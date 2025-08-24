"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { useSnackbar } from "src/components/snackbar";
import productsService from "src/services/products/products.service";
import ProductCreateView from "./product-create-view";

// ----------------------------------------------------------------------

export default function ProductEditView({ productId }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsService.getById(productId);
        console.log("Fetched product data:", data);
        setProduct(data);
        console.log("Set product state:", data);
      } catch (error) {
        enqueueSnackbar("Failed to fetch product", { variant: "error" });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, enqueueSnackbar]);

  const handleUpdate = async (formData) => {
    try {
      await productsService.update(productId, formData);
      enqueueSnackbar("Product updated successfully");
      router.push(paths.dashboard.product.root);
    } catch (error) {
      enqueueSnackbar("Failed to update product", { variant: "error" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography>Product not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ProductCreateView
      isEdit
      currentProduct={product}
      onSubmit={handleUpdate}
    />
  );
}
