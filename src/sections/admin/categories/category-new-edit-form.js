"use client";

import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { useSnackbar } from "src/components/snackbar";
import { CategoryService } from "src/services";

import FormProvider from "src/components/hook-form/form-provider";
import { RHFTextField, RHFSelect } from "src/components/hook-form";

// ----------------------------------------------------------------------

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  description: Yup.string(),
  parentId: Yup.string().nullable(),
});

export default function CategoryNewEditForm({
  isEdit,
  currentCategory,
  onSubmit: externalSubmit,
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [parentCategories, setParentCategories] = useState([]);

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
    },
  });

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await CategoryService.getAll();
        const categories =
          response?.data?.categories || response?.categories || [];
        console.log("All categories:", categories); // For debugging

        // Filter out the current category to prevent self-reference
        const availableParents = categories.filter(
          (cat) => cat._id !== currentCategory?._id
        );
        setParentCategories(availableParents);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        enqueueSnackbar("Failed to load parent categories", {
          variant: "error",
        });
      }
    };

    fetchParentCategories();
  }, [currentCategory, enqueueSnackbar]);

  // Reset form when currentCategory changes
  useEffect(() => {
    if (isEdit && currentCategory) {
      methods.reset({
        name: currentCategory.name || "",
        slug: currentCategory.slug || "",
        description: currentCategory.description || "",
        parentId: currentCategory.parent?._id || currentCategory.parent || "",
      });
    }
  }, [isEdit, currentCategory, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit && externalSubmit) {
        await externalSubmit(data);
      } else {
        // Handle create logic here if needed
        // For now, we're only handling edit
        console.error("Create functionality not implemented");
      }

      reset();
      enqueueSnackbar(isEdit ? "Update success!" : "Create success!");
      router.push(paths.dashboard.category.list);
    } catch (error) {
      console.error("Form submit error:", error);
      enqueueSnackbar(error.message || "Something went wrong", {
        variant: "error",
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          sx={{ p: 3 }}>
          <RHFTextField name="name" label="Category Name" />
          <RHFTextField name="slug" label="Slug" />
          <RHFTextField
            name="description"
            label="Description"
            multiline
            rows={3}
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />
          <RHFSelect
            native
            name="parentId"
            label="Parent Category"
            sx={{ gridColumn: { sm: "1 / -1" } }}>
            <option value="">None</option>
            {parentCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </RHFSelect>
        </Box>

        <Stack alignItems="flex-end" sx={{ p: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Category"}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  onSubmit: PropTypes.func,
};
