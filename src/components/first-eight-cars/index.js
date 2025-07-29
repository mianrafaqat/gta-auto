"use client";
import { Grid, Container, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductItem from "src/sections/product/product-item";
import { CarsService } from "src/services";

export default function LastestEightCars({allCars}) {
 

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mt: 4, mb: "12px" }}>
        Recommended for you
      </Typography>
      {allCars.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {allCars?.splice(0, 5).map((product) => (
            <Grid xs={12} md={6} lg={3} item key={product._id}>
              <ProductItem onHome product={product} />
            </Grid>
          ))}
        </Grid>
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
