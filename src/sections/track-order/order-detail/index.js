"use client";
import { Box, Typography, Card, Stack, Grid, Divider } from "@mui/material";
import React from "react";
import Iconify from "src/components/iconify";

const OrderDetail = () => {
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

  const progressSteps = [
    {
      id: 1,
      title: "Order Placed",
      icon: "eva:file-text-fill",
      completed: true,
      active: false,
    },
    {
      id: 2,
      title: "Packaging",
      icon: "eva:package-fill",
      completed: true,
      active: false,
    },
    {
      id: 3,
      title: "On The Road",
      icon: "eva:car-fill",
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: "Delivered",
      icon: "eva:shake-fill",
      completed: false,
      active: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000000",
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
              #96459761
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666666",
                fontSize: "14px",
              }}>
              4 Products • Order Placed in 17 Jan, 2025 at 7:32 PM
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2196F3",
            }}>
            Rs.25000
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                width: "100%",
              }}>
              {/* Progress Line */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: "#E0E0E0",
                  zIndex: 1,
                }}
              />

              {/* Completed Progress Line */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  width: "50%",
                  height: 2,
                  backgroundColor: "#4CAF50",
                  zIndex: 2,
                }}
              />

              {progressSteps.map((step, index) => (
                <Box
                  key={step.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 3,
                    flex: 1,
                  }}>
                  {/* Circle with Checkmark */}
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: step.completed ? "#4CAF50" : "#FFFFFF",
                      border: "2px solid",
                      borderColor: step.completed ? "#4CAF50" : "#E0E0E0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}>
                    {step.completed && (
                      <Iconify
                        icon="eva:checkmark-fill"
                        sx={{ color: "#FFFFFF", width: 16, height: 16 }}
                      />
                    )}
                  </Box>

                  {/* Text */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: step.completed ? "#000000" : "#999999",
                      fontWeight: 500,
                      textAlign: "center",
                      fontSize: "14px",
                      mt: 1,
                    }}>
                    {step.title}
                  </Typography>
                </Box>
              ))}
            </Box>
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
