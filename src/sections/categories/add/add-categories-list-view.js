"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useSnackbar } from "src/components/snackbar";
import { RHFTextField, RHFSelect } from "src/components/hook-form";
import FormProvider from "src/components/hook-form";
import CategoryService from "src/services/category/category.service";

// ----------------------------------------------------------------------

// Utility function to generate slug from string
function generateSlug(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  slug: Yup.string().required("Slug is required"),
  description: Yup.string(),
  parent: Yup.string().nullable(),
});

const defaultValues = {
  name: "",
  slug: "",
  description: "",
  parent: "",
};

// ----------------------------------------------------------------------

export default function AddCategoriesListView({ isEdit = false, categoryId }) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const isSubmittingRef = useRef(false);

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Watch name and slug for auto-generation
  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Auto-generate slug when name changes (debounced)
  useEffect(() => {
    if (!nameValue) {
      setValue("slug", "");
      return;
    }

    const timeoutId = setTimeout(() => {
      setValue("slug", generateSlug(nameValue));
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  // Fetch all categories for parent selection and category for edit
  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories...', { isEdit, categoryId });
      try {
        setLoading(true);
        const res = await CategoryService.getAll();
        const categoriesData = res?.data || [];
        setCategories(categoriesData);
        
        // If editing, find the specific category
        if (isEdit && categoryId) {
          const found = categoriesData.find((cat) => cat._id === categoryId);
          if (found) {
            reset({
              name: found.name || "",
              slug: found.slug || generateSlug(found.name || ""),
              description: found.description || "",
              parent: found.parent || "",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        if (isEdit && categoryId) {
          snackbar.enqueueSnackbar(
            error?.message || "Failed to fetch category",
            { variant: "error" }
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isEdit, categoryId, reset, snackbar]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  const onSubmit = useCallback(
    handleSubmit(async (data) => {
      // Prevent multiple submissions using ref
      if (isSubmittingRef.current || loading || isSubmitting) {
        return;
      }

      // Validate required fields
      if (!data.name || !data.slug) {
        snackbar.enqueueSnackbar("Please fill in all required fields", { variant: "error" });
        return;
      }

      try {
        isSubmittingRef.current = true;
        setLoading(true);
        
        const payload = {
          name: data.name.trim(),
          slug: data.slug.trim(),
          description: data.description?.trim() || "",
          parent: data.parent || null,
        };

        let response;
        if (isEdit) {
          response = await CategoryService.update(categoryId, payload);
        } else {
          response = await CategoryService.add(payload);
        }

        // Check for successful response
        if (response?.status === 200 || response?.success) {
          snackbar.enqueueSnackbar(
            `Category ${isEdit ? "updated" : "added"} successfully!`,
            { variant: "success" }
          );
          router.push(paths.dashboard.admin.categories.list);
        } else {
          throw new Error(response?.message || `Failed to ${isEdit ? "update" : "add"} category`);
        }
      } catch (error) {
        console.error('Category operation error:', error);
        snackbar.enqueueSnackbar(
          error?.message || `Failed to ${isEdit ? "update" : "add"} category`,
          { variant: "error" }
        );
      } finally {
        setLoading(false);
        isSubmittingRef.current = false;
      }
    }),
    [loading, isSubmitting, isEdit, categoryId, snackbar, router, handleSubmit]
  );

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.admin.categories.list);
  }, [router]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {isEdit ? "Edit Category" : "Add New Category"}
        </Typography>

        <FormProvider methods={methods}>
          <Box>
            <Stack spacing={3}>
              <RHFTextField
                name="name"
                label="Category Name"
                placeholder="Enter category name"
              />

              <RHFTextField
                name="slug"
                label="Slug"
                placeholder="Auto-generated slug"
                value={slugValue}
                InputProps={{
                  readOnly: true,
                }}
              />

              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                placeholder="Enter category description (optional)"
              />

              <RHFSelect name="parent" label="Parent Category" allowEmpty>
                <MenuItem value="">None</MenuItem>
                {categories
                  .filter((cat) => !isEdit || cat._id !== categoryId)
                  .map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </RHFSelect>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                  disabled={loading}>
                  Cancel
                </Button>

                <LoadingButton
                  onClick={onSubmit}
                  variant="contained"
                  loading={isSubmitting || loading}
                  disabled={isSubmitting || loading || isSubmittingRef.current}>
                  {isEdit ? "Update Category" : "Add Category"}
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Card>
    </Container>
  );
}
