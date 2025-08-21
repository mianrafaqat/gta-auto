"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  Skeleton,
  Alert,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";
import CategoryService from "src/services/category/category.service";

const CategoryOffers = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CategoryService.getAll();

        let categoriesData = [];

        if (response?.data?.success) {
          categoriesData = response.data.data || [];
        } else if (response?.data?.data) {
          categoriesData = response.data.data || [];
        } else if (Array.isArray(response?.data)) {
          categoriesData = response.data || [];
        } else if (Array.isArray(response)) {
          categoriesData = response || [];
        }

        // Flatten the hierarchical structure to show all categories
        const flattenedCategories = [];

        const flattenCategories = (cats) => {
          cats.forEach((cat) => {
            if (cat.isVisible !== false) {
              // Only show visible categories
              flattenedCategories.push(cat);
            }
            if (cat.children && cat.children.length > 0) {
              flattenCategories(cat.children);
            }
          });
        };

        flattenCategories(categoriesData);
        setCategories(flattenedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the category URL or use the slug
    if (category.url) {
      router.push(category.url);
    } else if (category.slug) {
      router.push(`/categories/${category.slug}`);
    } else {
      router.push(paths.cars.all + `?category=${category._id}`);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("men") || name.includes("clothing"))
      return "eva:person-fill";
    if (name.includes("chemical")) return "eva:droplet-fill";
    if (name.includes("interior")) return "eva:home-fill";
    if (name.includes("body")) return "eva:car-fill";
    if (name.includes("car")) return "eva:car-fill";
    if (name.includes("auto")) return "eva:car-fill";
    if (name.includes("vehicle")) return "eva:car-fill";
    return "eva:folder-fill";
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}>
          <Skeleton
            variant="text"
            width={300}
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={32}
            sx={{ bgcolor: "grey.800" }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 120,
              }}>
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{ bgcolor: "grey.800", mb: 2 }}
              />
              <Skeleton
                variant="text"
                width={80}
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black" }}>
        <Typography
          sx={{
            mb: "36",
            color: "#4CAF50",
            fontWeight: "bold",
            fontSize: { xs: "28px", md: "36px" },
          }}>
          Categories we offer
        </Typography>
        <Alert
          severity="error"
          sx={{ mb: 3, bgcolor: "rgba(244,67,54,0.1)", color: "#f44336" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (categories.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black" }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, color: "#4CAF50", fontWeight: "bold" }}>
          Categories we offer
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px solid",
            borderColor: "grey.800",
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.05)",
          }}>
          <Iconify
            icon="eva:car-outline"
            sx={{ fontSize: 64, color: "grey.400", mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1, color: "grey.300" }}>
            No Categories Available
          </Typography>
          <Typography variant="body2" color="grey.500">
            No categories found.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}>
        <Box sx={{ borderBottom: "2px solid #4CAF50", pb: "42px" }}>
          <Typography
            variant="h4"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              position: "relative",
            }}>
            Categories we offer
          </Typography>
        </Box>
      </Box>

      {/* Categories Row */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#4CAF50",
            borderRadius: 3,
          },
        }}>
        {categories.map((category) => (
          <Box
            key={category._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 120,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => handleCategoryClick(category)}>
            {/* Circular Category Element */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "grey.300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,

                overflow: "hidden",
                position: "relative",
              }}>
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <Iconify
                  icon={getCategoryIcon(category.name)}
                  sx={{
                    fontSize: 32,
                    color: "grey.600",
                  }}
                />
              )}
            </Box>

            {/* Category Name */}
            <Typography
              variant="body2"
              sx={{
                color: "#4CAF50",
                fontWeight: 500,
                textAlign: "center",
                fontSize: "0.875rem",
              }}>
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CategoryOffers;
