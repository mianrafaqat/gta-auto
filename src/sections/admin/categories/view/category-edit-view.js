"use client";

import { useEffect, useState } from "react";
import { useRouter } from "src/routes/hooks";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import { paths } from "src/routes/paths";
import { useSnackbar } from "src/components/snackbar";
import CategoryService from "src/services/category/category.service";
import CategoryNewEditForm from "../category-new-edit-form";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

// ----------------------------------------------------------------------

export default function CategoryEditView({ categoryId }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await CategoryService.getById(categoryId);
        // Extract category data from response
        const categoryData =
          response?.data?.category || response?.category || response;

        console.log("Category data:", categoryData); // For debugging

        if (!categoryData) {
          enqueueSnackbar("Category not found", { variant: "error" });
          router.push(paths.dashboard.category.list);
          return;
        }

        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching category:", error);
        enqueueSnackbar(error.message || "Failed to fetch category", {
          variant: "error",
        });
        router.push(paths.dashboard.category.list);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, enqueueSnackbar, router]);

  const handleUpdate = async (data) => {
    try {
      await CategoryService.update(categoryId, data);
      enqueueSnackbar("Category updated successfully");
      router.push(paths.dashboard.category.list);
    } catch (error) {
      console.error("Error updating category:", error);
      enqueueSnackbar(error.message || "Failed to update category", {
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <p>Category not found</p>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Edit Category"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Categories", href: paths.dashboard.category.list },
          { name: "Edit" },
        ]}
        sx={{ mb: 3 }}
      />

      <CategoryNewEditForm
        isEdit
        currentCategory={category}
        onSubmit={handleUpdate}
      />
    </Container>
  );
}
