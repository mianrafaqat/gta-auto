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

        // If data is nested in a 'product' field, extract it
        const productData = data.product || data;
        console.log("Processed product data:", productData);

        // Ensure we have the required fields
        if (!productData.name) {
          console.error(
            "Missing required fields in product data:",
            productData
          );
          enqueueSnackbar("Product data is incomplete", { variant: "error" });
          return;
        }

        setProduct(productData);
        console.log("Set product state:", productData);
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
      console.log("Updating product with ID:", productId);
      console.log("Update payload:", formData);

      // Ensure we have the product ID
      if (!productId) {
        throw new Error("Product ID is missing");
      }

      // Prepare the update data
      const updateData = {
        ...formData,
        // Ensure these fields are properly formatted
        price: Number(formData.price) || 0,
        regularPrice: Number(formData.regularPrice) || 0,
        salePrice: Number(formData.salePrice) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
        weight: Number(formData.weight) || 0,
        dimensions: {
          length: Number(formData.dimensions?.length) || 0,
          width: Number(formData.dimensions?.width) || 0,
          height: Number(formData.dimensions?.height) || 0,
        },
        // Convert categories to array if it's a single value
        categories: formData.category ? [formData.category] : [],
      };

      console.log("Formatted update payload:", updateData);

      // Call the update endpoint
      const response = await productsService.update(productId, updateData);
      console.log("Update response:", response);

      enqueueSnackbar("Product updated successfully", { variant: "success" });
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";
      enqueueSnackbar(errorMessage, { variant: "error" });
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
