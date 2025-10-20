"use client";
import PropTypes from "prop-types";
import { useRouter } from "src/routes/hooks";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";
import Image from "next/image";

export default function OrderSuccess({ order: propOrder }) {
  const router = useRouter();
  const [order, setOrder] = useState(propOrder);

  // Get order ID from URL query if not passed as prop
  useEffect(() => {
    const orderId = router.query?.orderId;
    if (orderId && !order) {
      // You can fetch order details here if needed
      setOrder({ id: orderId, status: "Processing" });
    }
  }, [router.query, order]);

  return (
    <Box
      sx={{
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 12,
      }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: 600,
            mx: "auto",
          }}>
          <Box
            sx={{
              backgroundColor: "transparent",
            }}>
            <Image
              src="/assets/tickIcon.svg"
              alt="order-success"
              width={88}
              height={88}
            />
          </Box>

          {/* Main Success Message */}
          <Typography
            variant="h4"
            sx={{
              mb: "12px",
              color: "#4CAF50",
              lineHeight: 1.2,
            }}>
            Your order is successfully placed
          </Typography>

          {/* Descriptive Text */}
          <Typography
            sx={{
              mb: 3,
              color: "#828282",
              maxWidth: 500,
              fontSize: "14px",
            }}>
            We are glad to serve you, our items will be packed soon and one of
            our team member will reach out to you soon for confirmation.
          </Typography>

          {/* Email Notification Info */}
          <Box
            sx={{
              mb: 5,
              p: 2,
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderRadius: 1,
              border: "1px solid rgba(76, 175, 80, 0.2)",
            }}>
            <Typography
              sx={{
                color: "#4CAF50",
                fontSize: "14px",
                fontWeight: "500",
                mb: 1,
              }}>
              📧 Email Notifications Sent:
            </Typography>
            <Typography
              sx={{
                color: "#828282",
                fontSize: "12px",
                mb: 0.5,
              }}>
              • Order confirmation sent to your email
            </Typography>
            <Typography
              sx={{
                color: "#828282",
                fontSize: "12px",
                mb: 0.5,
              }}>
              • Admin team notified of your order
            </Typography>
            <Typography
              sx={{
                color: "#828282",
                fontSize: "12px",
                fontStyle: "italic",
              }}>
              Please check your inbox and spam folder
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            sx={{ width: "100%" }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/")}
              sx={{
                borderColor: "#FFFFFF",
                color: "#4CAF50",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
                px: 4,
                py: 1.5,
                borderRadius: "2px",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}>
              <Iconify
                icon="eva:grid-fill"
                sx={{ mr: 1, width: 20, height: 20 }}
              />
              Go to Home
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(paths.trackOrder)}
              sx={{
                backgroundColor: "#4CAF50",
                color: "#FFFFFF",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
                px: 4,
                py: 1.5,
                borderRadius: "2px",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}>
              VIEW ORDER
              <Iconify
                icon="eva:arrow-forward-fill"
                sx={{ ml: 1, width: 20, height: 20 }}
              />
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

OrderSuccess.propTypes = {
  order: PropTypes.object,
};
