import PropTypes from "prop-types";
import { useRouter } from "src/routes/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";

export default function OrderSuccess({ order }) {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
      }}>
      <Card
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 720,
        }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" paragraph>
            Thank you for your purchase!
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Your order has been placed successfully.
            <br />
            We will send you a notification once your order is ready.
          </Typography>

          <Box
            component="img"
            src="/assets/icons/empty/ic_order_success.svg"
            sx={{
              mx: "auto",
              my: { xs: 5, sm: 8 },
              width: { xs: 200, sm: 240 },
            }}
          />
        </Box>

        <Stack spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Order number</Box>
            <Box component="span">{order?.orderNumber || "-"}</Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Order date</Box>
            <Box component="span">
              {new Date(order?.createdAt).toLocaleDateString()}
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Shipping method</Box>
            <Box component="span">{order?.shippingMethod?.name || "-"}</Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Payment method</Box>
            <Box component="span">{order?.paymentMethod || "-"}</Box>
          </Stack>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Subtotal</Box>
            <Box component="span">PKR {order?.subTotal?.toLocaleString()}</Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "subtitle2" }}>
            <Box component="span">Shipping</Box>
            <Box component="span">
              PKR {order?.shippingCost?.toLocaleString()}
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ typography: "h6" }}>
            <Box component="span">Total</Box>
            <Box component="span">PKR {order?.total?.toLocaleString()}</Box>
          </Stack>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between">
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={() => router.push(paths.product.root)}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
              Continue Shopping
            </Button>

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => router.push(paths.dashboard.order.root)}
              startIcon={<Iconify icon="solar:bill-list-bold" />}>
              View Orders
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}

OrderSuccess.propTypes = {
  order: PropTypes.object,
};
