import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";

import { useCheckoutContext } from "./context/checkout-context";
import CheckoutSummary from "./checkout-summary";
import CheckoutCartProductList from "./checkout-cart-product-list";

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();

  // Add null checks to prevent errors
  const items = checkout?.items || [];
  const empty = !items.length;

  // Debug logging
  console.log("CheckoutCart Debug:", {
    checkout,
    items,
    itemsLength: items.length,
    empty,
    hasCheckout: !!checkout,
    checkoutKeys: checkout ? Object.keys(checkout) : [],
    itemsType: typeof items,
    itemsIsArray: Array.isArray(items),
  });

  // Log each item in detail
  if (items.length > 0) {
    console.log(
      "Cart Items Details:",
      items.map((item, index) => ({
        index,
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        coverUrl: item.coverUrl,
      }))
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card
          sx={{
            mb: 3,
            background: "transparent",
            border: "1px solid #4caf50",
            color: "#fff",
          }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: "#4caf50" }}>
                  &nbsp;({items.length} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.product.root}
          color="inherit"
          sx={{
            color: "#4caf50",
          }}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Continue Shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          // disabled={empty}
          sx={{
            bgcolor: "#4caf50",
            color: "#fff",
          }}
          onClick={checkout.onNextStep}>
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
