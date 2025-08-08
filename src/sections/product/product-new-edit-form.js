import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { useResponsive } from "src/hooks/use-responsive";
import {
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from "src/_mock";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFMultiSelect,
} from "src/components/hook-form";

// Import the API service
import gtaAutosInstance from "src/utils/requestInterceptor";

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  const mdUp = useResponsive("up", "md");
  const { enqueueSnackbar } = useSnackbar();

  // Validation schema for only required fields
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    regularPrice: Yup.number().moreThan(0, "Regular price is required"),
    salePrice: Yup.number().nullable(),
    category: Yup.string().required("Category is required"),
    sizes: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      price: currentProduct?.price || 0,
      regularPrice: currentProduct?.regularPrice || 0,
      salePrice: currentProduct?.salePrice || 0,
      category: currentProduct?.categories?.[0] || "",
      sizes:
        currentProduct?.attributes?.find((a) => a.name === "Size")?.values ||
        [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  // Helper to get category as array of ids (for demo, just wrap in array)
  const getCategories = (category) => {
    if (!category) return [];
    return [category];
  };

  // Helper to build attributes array for API
  const getAttributes = (sizes) => {
    if (sizes && sizes.length > 0) {
      return [
        {
          name: "Size",
          values: sizes,
          isVariationAttribute: true,
        },
      ];
    }
    return [];
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Build request body for new API
      const body = {
        name: data.name,
        description: data.description,
        price:
          Number(data.salePrice) > 0
            ? Number(data.salePrice)
            : Number(data.price),
        regularPrice: Number(data.regularPrice),
        salePrice:
          Number(data.salePrice) > 0
            ? Number(data.salePrice)
            : Number(data.price),
        categories: getCategories(data.category),
        type: "simple",
        attributes: getAttributes(data.sizes),
      };

      // Only create if not editing
      if (!currentProduct) {
        const response = await gtaAutosInstance.post("/api/products", body);

        if (response.status === 200 || response.status === 201) {
          reset();
          enqueueSnackbar("Create success!");
          router.push(paths.dashboard.product.root);
          console.info("API BODY", body);
        } else {
          throw new Error("Failed to create product");
        }
      } else {
        // For edit, you may want to update this logic to call PUT/PATCH
        // For now, just simulate update
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar("Update success!");
        router.push(paths.dashboard.product.root);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message || "Something went wrong!", {
        variant: "error",
      });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title and description
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Category and attributes
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}>
              <RHFSelect
                name="category"
                label="Category"
                InputLabelProps={{ shrink: true }}>
                <MenuItem value="" disabled>
                  Select category
                </MenuItem>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="sizes"
                label="Sizes"
                options={PRODUCT_SIZE_OPTIONS}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="regularPrice"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      R.S
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="price"
              label="Current Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      R.S
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="salePrice"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      R.S
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}>
          {!currentProduct ? "Create Product" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderProperties}
        {renderPricing}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
