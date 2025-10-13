"use client";

import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";

import Stack from "@mui/material/Stack";
import { useAuthContext } from "src/auth/hooks";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { paths } from "src/routes/paths";

import { ORDER_STATUS_OPTIONS } from "src/_mock";

import { useSettingsContext } from "src/components/settings";
import { useGetOrderById } from "src/hooks/use-orders";
import { transformApiOrderToComponent } from "src/utils/order-transformer";
import { useSnackbar } from "src/components/snackbar";
import { OrdersService } from "src/services";
import OrderEmailService from "src/services/orders/orderEmail.service";

import OrderDetailsInfo from "../order-details-info";
import OrderDetailsItems from "../order-details-item";
import OrderDetailsToolbar from "../order-details-toolbar";
import OrderDetailsHistory from "../order-details-history";
import StatusUpdateDialog from "../status-update-dialog";

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  // Fetch order from API
  const { data: apiOrder, isLoading, error, refetch } = useGetOrderById(id);

  // Transform API data to component format
  const currentOrder = transformApiOrderToComponent(apiOrder);

  const [status, setStatus] = useState(currentOrder?.status || "pending");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle opening status dialog
  const handleChangeStatus = useCallback((newValue) => {
    setNewStatus(newValue);
    setIsStatusDialogOpen(true);
  }, []);


  // Handle actual status update
  const handleStatusUpdate = useCallback(
    async (note) => {
      setIsUpdating(true);
      try {
        // Call the API to update status with note
        await OrdersService.updateStatus(id, {
          status: newStatus,
          note,
          userId: user?.id, // Add user ID to request
        });
        console.log(currentOrder, "currentOrder");
        await OrderEmailService.sendOrderStatusUpdateEmail(currentOrder, newStatus, note);

        // Update local state
        setStatus(newStatus);

        // Show success message
        enqueueSnackbar("Order status updated successfully", {
          variant: "success",
        });

        // Close dialog
        setIsStatusDialogOpen(false);

        // Refresh order data
        refetch();
      } catch (error) {
        console.error("Error updating order status:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to update order status";
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        // Revert status on error
        setStatus(currentOrder?.status || "pending");
      } finally {
        setIsUpdating(false);
      }
    },
    [id, newStatus, currentOrder?.status, enqueueSnackbar, refetch]
  );

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  // Show error state
  if (error) {
    const isForbidden = error.status === 403 || error.isForbidden;
    const isNotFound = error.status === 404 || error.isNotFound;

    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Alert
          severity={isForbidden ? "warning" : isNotFound ? "info" : "error"}
          sx={{ mb: 3 }}>
          <strong>
            {isForbidden
              ? "Access Denied"
              : isNotFound
                ? "Order Not Found"
                : "Failed to load order:"}
          </strong>{" "}
          {error.message}
          {error.response?.status && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              Status: {error.response.status} {error.response.statusText}
            </Box>
          )}
          {error.response?.data?.message && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              Server: {error.response.data.message}
            </Box>
          )}
          {isForbidden && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              You don't have permission to view this order.
            </Box>
          )}
          {isNotFound && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              The order you're looking for doesn't exist or has been removed.
            </Box>
          )}
        </Alert>
        <Button onClick={() => refetch()} variant="contained" sx={{ mr: 2 }}>
          Retry
        </Button>
        <Button
          onClick={() => (window.location.href = "/dashboard/order")}
          variant="outlined">
          Back to Orders
        </Button>
      </Container>
    );
  }

  // Show not found state
  if (!currentOrder) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Alert severity="warning">Order not found</Alert>
      </Container>
    );
  }
  const isAdmin = user?.user?.role === "admin";

  return (
    <>
      <StatusUpdateDialog
        open={isStatusDialogOpen}
        status={newStatus}
        onClose={() => setIsStatusDialogOpen(false)}
        onSubmit={handleStatusUpdate}
        loading={isUpdating}
      />

      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <OrderDetailsToolbar
          backLink={isAdmin ? paths.dashboard.order.root : paths.dashboard.order.my}
          orderNumber={currentOrder.orderNumber}
          createdAt={currentOrder.createdAt}
          status={status}
          onChangeStatus={handleChangeStatus}
          statusOptions={ORDER_STATUS_OPTIONS}
        />

        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Stack
              spacing={3}
              direction={{ xs: "column-reverse", md: "column" }}>
              <OrderDetailsItems
                items={currentOrder.items}
                taxes={currentOrder.taxes}
                shipping={currentOrder.shipping}
                discount={currentOrder.discount}
                subTotal={currentOrder.subTotal}
                totalAmount={
                  currentOrder.totalAmount || currentOrder.totalAmount
                }
              />

              <OrderDetailsHistory history={currentOrder.history} />
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <OrderDetailsInfo
              customer={currentOrder.customer}
              delivery={currentOrder.delivery}
              payment={currentOrder.payment}
              shippingAddress={currentOrder.shippingAddress}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
