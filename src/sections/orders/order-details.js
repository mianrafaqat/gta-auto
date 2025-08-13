import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";

import Label from "src/components/label";
import { useSnackbar } from "src/components/snackbar";
import { useUpdateOrderStatus } from "src/hooks/use-orders";

// ----------------------------------------------------------------------

export default function OrderDetails({ order }) {
  const { enqueueSnackbar } = useSnackbar();
  const updateStatus = useUpdateOrderStatus();

  const {
    _id,
    orderNumber,
    items,
    status,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    total,
    subTotal,
    shipping,
    discount,
    couponCode,
    createdAt,
    updatedAt,
  } = order;

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: _id,
        data: {
          status: newStatus,
          note: `Order status updated to ${newStatus}`,
        },
      });
      enqueueSnackbar("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      enqueueSnackbar(error.message || "Failed to update order status", {
        variant: "error",
      });
    }
  };

  const renderOrderHeader = (
    <Card sx={{ mb: 3 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Order #{orderNumber || _id}
          </Typography>
          <Label
            variant="soft"
            color={
              (status === "completed" && "success") ||
              (status === "processing" && "warning") ||
              (status === "cancelled" && "error") ||
              (status === "pending" && "info") ||
              "default"
            }>
            {status?.toUpperCase()}
          </Label>
        </Stack>

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Order Date
            </Typography>
            <Typography variant="body1">
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Last Updated
            </Typography>
            <Typography variant="body1">
              {new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Stack>

        {status !== "completed" && status !== "cancelled" && (
          <Stack direction="row" spacing={2}>
            <LoadingButton
              variant="contained"
              color="success"
              loading={updateStatus.isPending}
              onClick={() => handleUpdateStatus("completed")}>
              Mark as Completed
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              color="error"
              loading={updateStatus.isPending}
              onClick={() => handleUpdateStatus("cancelled")}>
              Cancel Order
            </LoadingButton>
          </Stack>
        )}
      </Stack>
    </Card>
  );

  const renderItems = (
    <Card sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 3, pb: 2 }}>
        Order Items ({items?.length || 0} items)
      </Typography>

      <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
        {items?.map((item, index) => (
          <Box key={item.product || index}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.productName || `Product ${item.product}`}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Quantity: {item.quantity}
                  {item.variation && ` • Variation: ${item.variation}`}
                </Typography>
                {item.price && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Price: PKR {item.price?.toLocaleString()}
                  </Typography>
                )}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                PKR {((item.price || 0) * item.quantity).toLocaleString()}
              </Typography>
            </Stack>
            {index < items.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Card>
  );

  const renderShipping = (
    <Card sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 3, pb: 2 }}>
        Shipping Information
      </Typography>

      <Stack spacing={3} sx={{ px: 3, pb: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Shipping Address
          </Typography>
          <Card
            variant="outlined"
            sx={{ p: 2, backgroundColor: "background.neutral" }}>
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </Typography>
              <Typography variant="body2">
                {shippingAddress?.address1}
              </Typography>
              <Typography variant="body2">
                {shippingAddress?.city}, {shippingAddress?.state}{" "}
                {shippingAddress?.postcode}
              </Typography>
              <Typography variant="body2">
                {shippingAddress?.country}
              </Typography>
              <Typography variant="body2">
                Phone: {shippingAddress?.phone}
              </Typography>
              <Typography variant="body2">
                Email: {shippingAddress?.email}
              </Typography>
            </Stack>
          </Card>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Shipping Method
          </Typography>
          <Typography variant="body1">
            {shippingMethod?.name || shippingMethod || "Standard Shipping"}
          </Typography>
          {shippingMethod?.price && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Cost: PKR {shippingMethod.price.toLocaleString()}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );

  const renderPayment = (
    <Card>
      <Typography variant="h6" sx={{ p: 3, pb: 2 }}>
        Payment Information
      </Typography>

      <Stack spacing={3} sx={{ px: 3, pb: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Payment Method
          </Typography>
          <Label
            variant="soft"
            color={
              (paymentMethod === "card" && "success") ||
              (paymentMethod === "paypal" && "info") ||
              (paymentMethod === "cash" && "warning") ||
              "default"
            }>
            {paymentMethod?.toUpperCase() || "NOT SPECIFIED"}
          </Label>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Billing Address
          </Typography>
          <Card
            variant="outlined"
            sx={{ p: 2, backgroundColor: "background.neutral" }}>
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {billingAddress?.firstName} {billingAddress?.lastName}
              </Typography>
              <Typography variant="body2">
                {billingAddress?.address1}
              </Typography>
              <Typography variant="body2">
                {billingAddress?.city}, {billingAddress?.state}{" "}
                {billingAddress?.postcode}
              </Typography>
              <Typography variant="body2">{billingAddress?.country}</Typography>
            </Stack>
          </Card>
        </Box>

        {couponCode && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Coupon Code
            </Typography>
            <Label variant="soft" color="info">
              {couponCode}
            </Label>
          </Box>
        )}

        <Divider />

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">
              PKR {subTotal?.toLocaleString() || "0"}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shipping</Typography>
            <Typography variant="body2">
              PKR {shipping?.toLocaleString() || "0"}
            </Typography>
          </Stack>

          {discount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "success.main" }}>
                Discount
              </Typography>
              <Typography variant="body2" sx={{ color: "success.main" }}>
                -PKR {discount.toLocaleString()}
              </Typography>
            </Stack>
          )}

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total Amount
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "primary.main" }}>
              PKR {total?.toLocaleString() || "0"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Box>
      {renderOrderHeader}

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {renderItems}
          {renderShipping}
        </Grid>

        <Grid xs={12} md={4}>
          {renderPayment}
        </Grid>
      </Grid>
    </Box>
  );
}

OrderDetails.propTypes = {
  order: PropTypes.object,
};
