"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductList from "src/sections/product/product-list";
import ProductService from "src/services/products/products.service";

const ExpertCar = () => {
  const [chemicalProducts, setChemicalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChemicalProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll();
        let products = [];
        if (response && response.products) {
          products = response.products;
        } else if (response && response.data) {
          products = response.data;
        }
        // Filter products that have a category with name "Chemicals"
        const filtered = products.filter(
          (product) =>
            Array.isArray(product.categories) &&
            product.categories.some(
              (cat) =>
                cat &&
                (cat.name?.toLowerCase() === "chemicals" ||
                  cat.slug?.toLowerCase() === "chemicals")
            )
        );
        setChemicalProducts(filtered.slice(0, 4));
      } catch (error) {
        setChemicalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChemicalProducts();
  }, []);

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Box sx={{ maxWidth: "900px", width: "100%", mb: 6 }}>
        <Typography
          variant="h1"
          fontSize={{ md: "42px !important", xs: "24px !important" }}>
          Expert Car Detailing: From Luxury brands to your everyday ride in
          pakistan
        </Typography>
      </Box>

      <Box sx={{ width: "100%", mx: "auto" }}>
        <Grid item xs={12}>
          <ProductList
            products={chemicalProducts}
            loading={loading}
            itemsPerPage={4}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default ExpertCar;
