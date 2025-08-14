"use client";
import {
  Grid,
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import React from "react";
import ProductItem from "src/sections/product/product-item";
import { useGetAllCars } from "src/hooks/use-cars";
import { useRouter } from "next/navigation";
import GarageItem from "src/sections/garage/garage-item";
import { WhatsApp } from "@mui/icons-material";

export default function LastestEightCars() {
  const { data: allCarsData, isLoading, error } = useGetAllCars();

  const router = useRouter();

  // Filter out paused cars and get first 5
  const allCars =
    allCarsData?.data?.filter((c) => c?.status !== "Paused") || [];

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" color="white" sx={{ mt: 4, mb: 0 }}>
          Featured Used Cars for Sale​
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" color="white" sx={{ mt: 4, mb: 0 }}>
          Featured Used Cars for Sale​
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <Typography variant="h6" color="error">
            Error loading cars
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          mb: 4,
          alignItems: "center",
        }}>
        <Typography variant="h4" color="#4caf50" sx={{ mt: 4, mb: "12px" }}>
          Featured Used Cars for Sale​
        </Typography>
        <Button
          variant="text"
          onClick={() => router.push("/cars")}
          sx={{
            color: "#4caf50",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              textDecoration: "underline",
            },
            px: 4,
            py: 1,
          }}>
          View All Cars
        </Button>
      </Box>

      {allCars.length > 0 ? (
        <>
          <Box
            sx={{
              mb: 4,
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                minWidth: "fit-content",
                px: { xs: 2, md: 0 },
              }}>
              {allCars.slice(0, 4).map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    minWidth: {
                      xs: "280px",
                      md: "auto",
                    },
                    flexShrink: 0,
                    width: {
                      md: "calc(25% - 16px)",
                    },
                  }}>
                  <GarageItem onHome key={product._id} product={product} />
                </Box>
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <Typography variant="h6" color="text.secondary">
            No cars found
          </Typography>
        </Box>
      )}

      <Box sx={{ width: "100%", display: { md: "block", xs: "none" } }}>
        <Card
          sx={{
            background: "#25D366",
            borderRadius: 3,
            mb: 4,
            height: "100%",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          }}>
          <CardContent
            sx={{
              p: { xs: 4, md: "32px" },
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}>
            <Stack direction="row" gap={2} alignItems="center">
              <Box>
                <img
                  src="/assets/convertable.png"
                  alt="Comic"
                  // width={450}
                  // height={150}
                />
              </Box>

              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "2rem", md: "34px !important" },
                    lineHeight: 1.2,
                  }}>
                  Import Your Dream Car
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    fontSize: "16px !important",
                    mb: 4,
                    fontWeight: 400,
                    opacity: 0.9,
                    maxWidth: 800,
                    mx: "auto",
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}>
                  From luxury brands to your everyday ride, we make importing
                  your dream car a reality. Expert guidance, competitive
                  pricing, and seamless process.
                </Typography>
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent="center"
                alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
                  onClick={() => {
                    const message =
                      "Hi! I'm interested in importing car parts. Can you help me find the parts I need?";
                    const whatsappUrl = `https://wa.me/923263333456?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  sx={{
                    backgroundColor: "transparent",
                    border: "1px solid #fff",
                    color: "#000",
                    px: 4,
                    py: 2,
                    fontSize: "16px !important",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderRadius: "50px",
                    minWidth: 250,
                    whiteSpace: "nowrap",
                  }}>
                  Chat on WhatsApp
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
