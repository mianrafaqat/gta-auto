"use client";
import { Grid, Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import React from "react";
import ProductItem from "src/sections/product/product-item";
import { useGetAllCars } from "src/hooks/use-cars";
import { useRouter } from "next/navigation";

export default function LastestEightCars() {
  const { data: allCarsData, isLoading, error } = useGetAllCars();

  const router = useRouter();

  // Filter out paused cars and get first 5
  const allCars = allCarsData?.data?.filter(c => c?.status !== 'Paused') || [];

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" color="white" sx={{ mt: 4, mb: 0 }}>
          Recommended for you
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px'
        }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" color="white" sx={{ mt: 4, mb: 0 }}>
          Recommended for you
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px'
        }}>
          <Typography variant="h6" color="error">
            Error loading cars
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" color="white" sx={{ mt: 4, mb: "12px" }}>
        Recommended for you
      </Typography>
      {allCars.length > 0 ? (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {allCars.slice(0, 4).map((product) => (
              <Grid xs={12} md={6} lg={3} item key={product._id}>
                <ProductItem onHome product={product} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button 
              variant="contained" 
              onClick={() => router.push("/cars")}
              sx={{
                backgroundColor: '#4caf50',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                px: 4,
                py: 1,
              }}
            >
              View All Cars
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px'
        }}>
          <Typography variant="h6" color="text.secondary">
            No cars found
          </Typography>
        </Box>
      )}
    </Container>
  );
}
