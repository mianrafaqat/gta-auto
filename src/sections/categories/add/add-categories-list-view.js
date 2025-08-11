"use client";

import { useState, useCallback, useEffect } from "react";
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

  // Auto-generate slug when name changes
  useEffect(() => {
    setValue("slug", generateSlug(nameValue || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  // Fetch all categories for parent selection
  useEffect(() => {
    CategoryService.getAll()
      .then((res) => {
        setCategories(res?.data || []);
      })
      .catch((err) => {
        setCategories([]);
      });
  }, []);

  // Fetch category for edit
  useEffect(() => {
    if (isEdit && categoryId) {
      setLoading(true);
      CategoryService.getAll()
        .then((res) => {
          setCategories(res?.data || []);
        })
        .catch(() => setCategories([]));
      CategoryService.getAll() // Replace with getById if available
        .then((res) => {
          const found = (res?.data || []).find((cat) => cat._id === categoryId);
          if (found) {
            reset({
              name: found.name || "",
              slug: found.slug || generateSlug(found.name || ""),
              description: found.description || "",
              parent: found.parent || "",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          snackbar.enqueueSnackbar(
            error?.message || "Failed to fetch category",
            {
              variant: "error",
            }
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEdit, categoryId, reset, snackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parent: data.parent || null,
      };

      if (isEdit) {
        const response = await CategoryService.update(categoryId, payload);
        if (response?.status === 200) {
          snackbar.enqueueSnackbar("Category updated successfully!");
          router.push(paths.dashboard.admin.categories.list);
        }
      } else {
        const response = await CategoryService.add(payload);
        if (response?.status === 200) {
          snackbar.enqueueSnackbar("Category added successfully!");
          router.push(paths.dashboard.admin.categories.list);
        }
      }
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar(
        error?.message || `Failed to ${isEdit ? "update" : "add"} category`,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  });

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
                  loading={isSubmitting || loading}>
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
