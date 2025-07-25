"use client";
import { Grid, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductItem from "src/sections/product/product-item";
import { CarsService } from "src/services";

export default function LastestEightCars() {
  const [allCars, setAllCars] = useState([]);

  const fetchAllCars = async () => {
    try {
      const res = await CarsService.getAll();
      if (res?.status === 200) {
        const filteredCar = res?.data?.filter(c => c?.status !== 'Paused') || [];
        setAllCars(filteredCar);
      }
    } catch (e) {
      console.log("error: ", err);
    }
  };
  useEffect(() => {
    fetchAllCars();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mt: 4,mb:0 }}>
        Recommended for you
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4}}>
        {allCars?.splice(0, 12).map((product) => (
          <Grid xs={12} md={6} lg={2} item key={product._id} >
            <ProductItem onHome product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
