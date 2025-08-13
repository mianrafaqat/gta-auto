import PropTypes from "prop-types";
import { useRouter } from "src/routes/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";

export default function OrderSuccess({ order }) {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        }}>
        <Card
          sx={{
            p: { xs: 3, md: 5 },
            width: "100%",
            maxWidth: 720,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(76, 175, 80, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            {/* Success Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
              }}>
              <Iconify
                icon="eva:checkmark-fill"
                sx={{
                  width: 40,
                  height: 40,
                  color: "white",
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#4caf50",
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}>
              🎉 Order Placed Successfully!
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 1,
                fontWeight: 500,
              }}>
              Thank you for your purchase!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 400,
                mx: "auto",
                lineHeight: 1.6,
              }}>
              Your order has been confirmed and is being processed.
              <br />
              We'll send you updates via email and SMS.
            </Typography>
          </Box>

          {/* Order Details */}
          <Card
            sx={{
              p: 3,
              mb: 4,
              background: "rgba(76, 175, 80, 0.05)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              borderRadius: 2,
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#4caf50",
                fontWeight: 600,
                textAlign: "center",
              }}>
              Order Details
            </Typography>

            <Stack spacing={2.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "subtitle2",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.05)" },
                }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Order Number
                </Box>
                <Box
                  component="span"
                  sx={{ color: "#4caf50", fontWeight: 600 }}>
                  #{order?.orderNumber || "N/A"}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "subtitle2",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.05)" },
                }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Order Date
                </Box>
                <Box component="span">
                  {new Date(order?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "subtitle2",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.05)" },
                }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Payment Method
                </Box>
                <Box component="span" sx={{ textTransform: "capitalize" }}>
                  {order?.paymentMethod || "N/A"}
                </Box>
              </Stack>

              <Divider sx={{ borderStyle: "dashed", borderColor: "#4caf50" }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "subtitle2",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.05)" },
                }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Subtotal
                </Box>
                <Box component="span">
                  PKR {order?.subTotal?.toLocaleString() || "0"}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "subtitle2",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.05)" },
                }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Shipping
                </Box>
                <Box component="span">
                  PKR {order?.shippingCost?.toLocaleString() || "0"}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  typography: "h6",
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid rgba(76, 175, 80, 0.2)",
                }}>
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Total Amount
                </Box>
                <Box
                  component="span"
                  sx={{ color: "#4caf50", fontWeight: 700 }}>
                  PKR {order?.total?.toLocaleString() || "0"}
                </Box>
              </Stack>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center">
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={() => router.push(paths.product.root)}
              startIcon={<Iconify icon="eva:shopping-cart-fill" />}
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#45a049",
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                },
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}>
              Continue Shopping
            </Button>

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => router.push(paths.product.root)}
              startIcon={<Iconify icon="eva:home-fill" />}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}>
              Go to Product Page
            </Button>
          </Stack>

          {/* Additional Info */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}>
              Need help? Contact our support team at{" "}
              <Box component="span" sx={{ color: "#4caf50", fontWeight: 500 }}>
                support@cityautos.com
              </Box>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

OrderSuccess.propTypes = {
  order: PropTypes.object,
};
