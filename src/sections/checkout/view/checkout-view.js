"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { PRODUCT_CHECKOUT_STEPS } from "src/_mock/_product";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";

import CheckoutCart from "../checkout-cart";
import CheckoutSteps from "../checkout-steps";
import { useCheckoutContext } from "../context";
import CheckoutPayment from "../checkout-payment";
import CheckoutOrderComplete from "../checkout-order-complete";
import CheckoutBillingAddress from "../checkout-billing-address";

// ----------------------------------------------------------------------

export default function CheckoutView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const checkout = useCheckoutContext();

  const isEmpty = !checkout.items || checkout.items.length === 0;

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"} sx={{ mb: 10 }}>
      <Typography
        variant="h4"
        sx={{ color: "white", mb: { xs: 3, md: 5 }, mt: "80px" }}>
        Checkout
      </Typography>

      {isEmpty && !checkout.completed ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 3,
          }}>
          <Iconify
            icon="solar:cart-cross-bold-duotone"
            width={100}
            sx={{ mx: "auto", mb: 3, color: "text.disabled" }}
          />
          <Typography variant="h5" sx={{ mb: 1, color: "white" }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={() => router.push(paths.product.root)}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}>
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <Grid
            container
            justifyContent={checkout.completed ? "center" : "flex-start"}>
            <Grid xs={12} md={8}>
              <CheckoutSteps
                activeStep={checkout.activeStep}
                steps={PRODUCT_CHECKOUT_STEPS}
              />
            </Grid>
          </Grid>

          {checkout.completed ? (
            <CheckoutOrderComplete
              open={checkout.completed}
              onReset={checkout.onReset}
              onDownloadPDF={() => {}}
            />
          ) : (
            <>
              {checkout.activeStep === 0 && <CheckoutCart />}

              {checkout.activeStep === 1 && <CheckoutBillingAddress />}

              {checkout.activeStep === 2 && checkout.billing && <CheckoutPayment />}
            </>
          )}
        </>
      )}
    </Container>
  );
}
