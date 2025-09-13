"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  InputAdornment,
} from "@mui/material";
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import HeroBottom from "src/components/heroBottom";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      enqueueSnackbar("Please enter your Order ID", { variant: "error" });
      return;
    }
    if (!billingEmail.trim()) {
      enqueueSnackbar("Please enter your Billing Email", { variant: "error" });
      return;
    }

    // Here you would typically make an API call to track the order
    console.log("Tracking order:", { orderId, billingEmail });
    enqueueSnackbar("Order tracking request submitted", { variant: "success" });
    router.push(paths.dashboard.orderDetail(orderId));
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        display: "flex",
        py: 8,
      }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: 800,
          }}>
          {/* Header Section */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: "#4CAF50",
            }}>
            Track Order
          </Typography>

          <Typography
            sx={{
              mb: 5,
              color: "#828282",

              fontSize: "14px",
            }}>
            To track your order please enter your order ID in the input field
            below and press the "Track Order" button. this was given to you on
            your receipt and in the confirmation email you should have received.
          </Typography>

          {/* Input Fields Section */}
          <Grid container spacing={3} sx={{ mb: 3, width: "100%" }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "#4CAF50",
                  fontWeight: 500,
                }}>
                Order ID
              </Typography>
              <TextField
                fullWidth
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ID..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#FFFFFF",
                    "& fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4CAF50",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333333",
                    "&::placeholder": {
                      color: "#999999",
                      opacity: 1,
                    },
                  },
                }}
              />

              {/* Information Hint */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1 }}>
                <Iconify
                  icon="eva:info-fill"
                  sx={{
                    color: "#4CAF50",
                    width: 16,
                    height: 16,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#4CAF50",
                    opacity: 0.8,
                    fontSize: "12px",
                  }}>
                  Order ID that we sended to your in your email address.
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "#4CAF50",
                  fontWeight: 500,
                }}>
                Billing Email
              </Typography>
              <TextField
                fullWidth
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="Email address"
                variant="outlined"
                type="email"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#FFFFFF",
                    "& fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4CAF50",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333333",
                    "&::placeholder": {
                      color: "#999999",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleTrackOrder}
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
            TRACK ORDER
            <Iconify
              icon="eva:arrow-forward-fill"
              sx={{ ml: 1, width: 20, height: 20 }}
            />
          </Button>
        </Box>
        {/* <HeroBottom bgColor="transparent" /> */}
      </Container>
    </Box>
  );
};

export default TrackOrder;
