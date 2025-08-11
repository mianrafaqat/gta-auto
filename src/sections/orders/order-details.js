import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import Label from "src/components/label";
import { useSnackbar } from "src/components/snackbar";
import { useUpdateOrderStatus } from "src/hooks/use-orders";

// ----------------------------------------------------------------------

export default function OrderDetails({ order }) {
  const { enqueueSnackbar } = useSnackbar();
  const updateStatus = useUpdateOrderStatus();

  const {
    _id,
    items,
    status,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    total,
    couponCode,
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

  const renderStatus = (
    <Card sx={{ mb: 3 }}>
      <Stack
        spacing={2}
        sx={{
          p: 3,
          typography: "body2",
        }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">Order Status</Typography>
          <Label
            variant="soft"
            color={
              (status === "completed" && "success") ||
              (status === "processing" && "warning") ||
              (status === "cancelled" && "error") ||
              "default"
            }>
            {status}
          </Label>
        </Stack>

        {status !== "completed" && status !== "cancelled" && (
          <Stack direction="row" spacing={2}>
            <LoadingButton
              variant="soft"
              color="success"
              loading={updateStatus.isPending}
              onClick={() => handleUpdateStatus("completed")}>
              Mark as Completed
            </LoadingButton>
            <LoadingButton
              variant="soft"
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
      <Typography variant="h6" sx={{ p: 3 }}>
        Order Items
      </Typography>

      <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
        {items.map((item) => (
          <Stack
            key={item.product}
            direction="row"
            justifyContent="space-between">
            <Typography variant="body2">
              {item.quantity}x {item.product}
              {item.variation && ` (${item.variation})`}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  const renderShipping = (
    <Card sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 3 }}>
        Shipping Information
      </Typography>

      <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Shipping Address</Typography>
          <Typography variant="body2">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </Typography>
          <Typography variant="body2">{shippingAddress.address1}</Typography>
          <Typography variant="body2">
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postcode}
          </Typography>
          <Typography variant="body2">{shippingAddress.country}</Typography>
          <Typography variant="body2">
            Phone: {shippingAddress.phone}
          </Typography>
          <Typography variant="body2">
            Email: {shippingAddress.email}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Shipping Method</Typography>
          <Typography variant="body2">{shippingMethod}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderPayment = (
    <Card>
      <Typography variant="h6" sx={{ p: 3 }}>
        Payment Information
      </Typography>

      <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Payment Method</Typography>
          <Label
            variant="soft"
            color={
              (paymentMethod === "card" && "success") ||
              (paymentMethod === "paypal" && "info") ||
              "default"
            }>
            {paymentMethod}
          </Label>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Billing Address</Typography>
          <Typography variant="body2">
            {billingAddress.firstName} {billingAddress.lastName}
          </Typography>
          <Typography variant="body2">{billingAddress.address1}</Typography>
          <Typography variant="body2">
            {billingAddress.city}, {billingAddress.state}{" "}
            {billingAddress.postcode}
          </Typography>
          <Typography variant="body2">{billingAddress.country}</Typography>
        </Stack>

        {couponCode && (
          <Stack spacing={1}>
            <Typography variant="subtitle2">Coupon Code</Typography>
            <Label variant="soft" color="info">
              {couponCode}
            </Label>
          </Stack>
        )}

        <Stack spacing={1}>
          <Typography variant="subtitle2">Total Amount</Typography>
          <Typography variant="h5">${total.toFixed(2)}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>{renderStatus}</Grid>

      <Grid xs={12} md={8}>
        {renderItems}
        {renderShipping}
      </Grid>

      <Grid xs={12} md={4}>
        {renderPayment}
      </Grid>
    </Grid>
  );
}

OrderDetails.propTypes = {
  order: PropTypes.object,
};
