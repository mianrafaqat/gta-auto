"use client";
import { Box, Typography, Card, Stack, Grid, Divider } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import React from "react";
import Iconify from "src/components/iconify";
import { useGetOrderById } from "src/hooks/use-orders";

const OrderDetail = ({ id }) => {
  const { data: apiOrder, isLoading, error, refetch } = useGetOrderById(id);

  console.log("apiOrder", apiOrder);

  const orderActivities = [
    {
      id: 1,
      type: "delivered",
      text: "Your order has been delivered. Thank you for shopping at Garage Tuned Autos!",
      date: "23 Jan, 2021 at 7:32 PM",
      icon: "eva:checkmark-fill",
      iconBg: "#E8F5E8",
      iconColor: "#4CAF50",
    },
    {
      id: 2,
      type: "picked",
      text: "Our delivery man (John Wick) Has picked-up your order for delvery.",
      date: "23 Jan, 2021 at 2:00 PM",
      icon: "eva:person-fill",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      id: 3,
      type: "hub",
      text: "Your order has reached at last mile hub.",
      date: "22 Jan, 2021 at 8:00 AM",
      icon: "eva:pin-fill",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      id: 4,
      type: "onway",
      text: "Your order on the way to (last mile) hub.",
      date: "21, 2021 at 5:32 AM",
      icon: "eva:map-fill",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      id: 5,
      type: "verified",
      text: "Your order is successfully verified.",
      date: "20 Jan, 2021 at 7:32 PM",
      icon: "eva:checkmark-fill",
      iconBg: "#E8F5E8",
      iconColor: "#4CAF50",
    },
    {
      id: 6,
      type: "confirmed",
      text: "Your order has been confirmed.",
      date: "19 Jan, 2021 at 2:61 PM",
      icon: "eva:file-text-fill",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
  ];

  // Custom Step Icon Component
  const CustomStepIcon = ({ active, completed, icon, stepNumber }) => {
    return (
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: completed ? "#4CAF50" : "#FFFFFF",
          border: "2px solid",
          borderColor: completed ? "#4CAF50" : "#E0E0E0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          position: "relative",
          zIndex: 2,
        }}>
        {completed && stepNumber === 1 && (
          <Iconify
            icon="eva:checkmark-fill"
            sx={{ color: "#FFFFFF", width: 16, height: 16 }}
          />
        )}
      </Box>
    );
  };

  const steps = [
    {
      label: "Order Placed",
      icon: "eva:file-text-fill",
      completed: true,
    },
    {
      label: "Packaging",
      icon: "eva:package-fill",
      completed: true,
    },
    {
      label: "On The Road",
      icon: "eva:car-fill",
      completed: false,
    },
    {
      label: "Delivered",
      icon: "eva:shake-fill",
      completed: false,
    },
  ];

  const activeStep = 1; // Packaging step is active

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}>
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          mx: 2,
          borderRadius: 2,
          overflow: "hidden",
        }}>
        {/* Order Summary Header */}
        <Box
          sx={{
            backgroundColor: "#FDFCEF",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#000000",
                mb: 1,
              }}>
              {apiOrder?.orderNumber}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666666",
                fontSize: "14px",
              }}>
              {apiOrder?.items?.length} Products • Order Placed in{" "}
              {apiOrder?.createdAt
                ? new Date(apiOrder.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2196F3",
            }}>
            PKR {apiOrder?.totalAmount}
          </Typography>
        </Box>

        {/* Expected Arrival */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              fontWeight: 500,
              mb: 3,
            }}>
            Order expected arrival 23 Jan, 2021
          </Typography>

          {/* Progress Tracker */}
          <Box sx={{ mb: 4, mt: 4, px: 4 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": {
                  borderTopWidth: 3,
                  borderColor: "#E0E0E0",
                  marginLeft: 0,
                  marginRight: 0,
                },
                "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
                  {
                    borderColor: "#4CAF50",
                  },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderColor: "#4CAF50",
                },
                "& .MuiStepConnector-root": {
                  paddingLeft: 0,
                  paddingRight: 0,
                  top: 12,
                },
                "& .MuiStepConnector-line": {
                  minWidth: "auto",
                },
                "& .MuiStepLabel-root": {
                  flexDirection: "column",
                },
                "& .MuiStepLabel-label": {
                  color: "#000000",
                  fontWeight: 500,
                  fontSize: "14px",
                  mt: 1,
                },
                "& .MuiStepLabel-label.Mui-disabled": {
                  color: "#999999",
                },
              }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon
                        {...props}
                        stepNumber={index + 1}
                        icon={step.icon}
                      />
                    )}
                    StepIconProps={{
                      icon: index + 1,
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {step.label}
                      </Typography>
                      <Iconify
                        icon={step.icon}
                        sx={{
                          color: step.completed ? "#4CAF50" : "#999999",
                          width: 20,
                          height: 20,
                        }}
                      />
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Order Activity */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 3,
            }}>
            Order Activity
          </Typography>

          <Stack spacing={2}>
            {orderActivities.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    backgroundColor: activity.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.5,
                  }}>
                  <Iconify
                    icon={activity.icon}
                    sx={{
                      color: activity.iconColor,
                      width: 16,
                      height: 16,
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#000000",
                      mb: 0.5,
                      lineHeight: 1.4,
                    }}>
                    {activity.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666666",
                      fontSize: "12px",
                    }}>
                    {activity.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default OrderDetail;
