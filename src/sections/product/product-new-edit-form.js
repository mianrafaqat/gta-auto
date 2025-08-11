import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { useResponsive } from "src/hooks/use-responsive";
import { PRODUCT_SIZE_OPTIONS } from "src/_mock";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFMultiSelect,
} from "src/components/hook-form";
import Iconify from "src/components/iconify";

// Import the ProductService API service
import {
  ProductService,
  CategoryService,
  AttributeService,
} from "src/services";

// Utility function to generate slug from string
function generateSlug(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Product type options
const PRODUCT_TYPE_OPTIONS = [
  { value: "simple", label: "Simple Product" },
  { value: "variable", label: "Variable Product" },
];

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  const mdUp = useResponsive("up", "md");
  const { enqueueSnackbar } = useSnackbar();

  // State for categories fetched from API
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // State for attributes fetched from API
  const [attributes, setAttributes] = useState([]);
  const [attributesLoading, setAttributesLoading] = useState(false);

  // State for slug
  const [slug, setSlug] = useState(currentProduct?.slug || "");

  // State for product type
  const [productType, setProductType] = useState(
    currentProduct?.type || "simple"
  );

  // State for selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  // State for variations dialog
  const [variationsDialogOpen, setVariationsDialogOpen] = useState(false);
  const [variations, setVariations] = useState([]);
  const [generatingVariations, setGeneratingVariations] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    setCategoriesLoading(true);
    CategoryService.getAll()
      .then((res) => {
        setCategories(res?.data || []);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch attributes on mount
  useEffect(() => {
    setAttributesLoading(true);
    AttributeService.getAll()
      .then((res) => {
        setAttributes(res?.data || []);
      })
      .catch(() => {
        setAttributes([]);
      })
      .finally(() => setAttributesLoading(false));
  }, []);

  // Validation schema for only required fields
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required"),
    productType: Yup.string().required("Product type is required"),
    price: Yup.number().when("productType", {
      is: (val) => val === "simple",
      then: (schema) =>
        schema
          .moreThan(0, "Price should not be $0.00")
          .required("Price is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    regularPrice: Yup.number().when("productType", {
      is: (val) => val === "simple",
      then: (schema) =>
        schema
          .moreThan(0, "Regular price is required")
          .required("Regular price is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    salePrice: Yup.number().nullable(),
    category: Yup.string().required("Category is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      slug: currentProduct?.slug || "",
      description: currentProduct?.description || "",
      productType: currentProduct?.type || "simple",
      price: currentProduct?.price || 0,
      regularPrice: currentProduct?.regularPrice || 0,
      salePrice: currentProduct?.salePrice || 0,
      category: currentProduct?.categories?.[0] || "",
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Auto-generate slug when name changes
  useEffect(() => {
    const nameValue = values.name || "";
    const generatedSlug = generateSlug(nameValue);
    setSlug(generatedSlug);
    setValue("slug", generatedSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name]);

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
      setSlug(currentProduct?.slug || "");
      setProductType(currentProduct?.type || "simple");

      // Set selected attributes from current product
      if (currentProduct?.attributes) {
        setSelectedAttributes(currentProduct.attributes);
      }
    }
  }, [currentProduct, defaultValues, reset]);

  // Handle product type change
  const handleProductTypeChange = (event) => {
    const newType = event.target.value;
    setProductType(newType);
    setValue("productType", newType);

    // Reset pricing for variable products
    if (newType === "variable") {
      setValue("price", 0);
      setValue("regularPrice", 0);
      setValue("salePrice", 0);
    }
  };

  // Handle attribute selection
  const handleAttributeSelect = (attribute) => {
    const isSelected = selectedAttributes.find(
      (attr) => attr._id === attribute._id
    );
    if (!isSelected) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  // Handle attribute removal
  const handleAttributeRemove = (attributeId) => {
    setSelectedAttributes(
      selectedAttributes.filter((attr) => attr._id !== attributeId)
    );
  };

  // Generate variations from selected attributes
  const generateVariations = () => {
    if (selectedAttributes.length === 0) {
      enqueueSnackbar("Please select at least one attribute", {
        variant: "warning",
      });
      return;
    }

    setGeneratingVariations(true);

    // Generate all possible combinations
    const generateCombinations = (attributes, index = 0, current = {}) => {
      if (index === attributes.length) {
        return [current];
      }

      const attribute = attributes[index];
      const combinations = [];

      attribute.values.forEach((value) => {
        const newCombination = { ...current, [attribute.name]: value.name };
        combinations.push(
          ...generateCombinations(attributes, index + 1, newCombination)
        );
      });

      return combinations;
    };

    const combinations = generateCombinations(selectedAttributes);
    const newVariations = combinations.map((combination, index) => ({
      id: `temp-${index}`,
      attributes: combination,
      price: 0, // This will be calculated from regularPrice or salePrice
      regularPrice: 0,
      salePrice: 0,
      stock: 0,
      sku: "",
    }));

    setVariations(newVariations);
    setVariationsDialogOpen(true);
    setGeneratingVariations(false);
  };

  // Helper to calculate effective price for variations
  const calculateEffectivePrice = (regularPrice, salePrice) => {
    return salePrice > 0 ? salePrice : regularPrice;
  };

  // Save variations
  const saveVariations = () => {
    // Validate variations - check for regularPrice and ensure it's greater than 0
    const invalidVariations = variations.filter(
      (v) => !v.regularPrice || v.regularPrice <= 0
    );
    if (invalidVariations.length > 0) {
      const invalidCount = invalidVariations.length;
      enqueueSnackbar(
        `${invalidCount} variation(s) missing required pricing information`,
        { variant: "error" }
      );
      return;
    }

    // Update price field for each variation
    const updatedVariations = variations.map((variation) => ({
      ...variation,
      price: calculateEffectivePrice(
        variation.regularPrice,
        variation.salePrice
      ),
    }));

    setVariations(updatedVariations);
    setVariationsDialogOpen(false);
    enqueueSnackbar("Variations saved successfully!", { variant: "success" });
  };

  // Helper to get category as array of ids
  const getCategories = (category) => {
    if (!category) return [];
    return [category];
  };

  // Helper to build attributes array for API
  const getAttributes = () => {
    return selectedAttributes.map((attr) => ({
      name: attr.name,
      values: attr.values,
      isVariationAttribute: true,
    }));
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Build request body for new API
      const body = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.productType,
        categories: getCategories(data.category),
      };

      // Add pricing based on product type
      if (data.productType === "simple") {
        body.price =
          Number(data.salePrice) > 0
            ? Number(data.salePrice)
            : Number(data.price);
        body.regularPrice = Number(data.regularPrice);
        body.salePrice =
          Number(data.salePrice) > 0
            ? Number(data.salePrice)
            : Number(data.price);
      } else {
        // For variable products, add attributes
        body.attributes = getAttributes();
      }

      if (!currentProduct) {
        // Create product using productService
        const response = await ProductService.create(body);

        if (response && response.id) {
          // If it's a variable product and we have variations, create them
          if (data.productType === "variable" && variations.length > 0) {
            const productId = response.id;

            for (const variation of variations) {
              const effectivePrice = calculateEffectivePrice(
                variation.regularPrice,
                variation.salePrice
              );
              await ProductService.createVariation(productId, {
                attributes: variation.attributes,
                price: effectivePrice,
                regularPrice: variation.regularPrice,
                salePrice: variation.salePrice > 0 ? variation.salePrice : 0,
                stock: variation.stock,
                sku: variation.sku,
              });
            }
          }

          reset();
          enqueueSnackbar("Create success!");
          router.push(paths.dashboard.product.root);
          console.info("API BODY", body);
        } else {
          throw new Error("Failed to create product");
        }
      } else {
        // Update product using productService
        await ProductService.update(currentProduct.id, body);
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

            <RHFTextField
              name="slug"
              label="Slug"
              placeholder="Auto-generated slug"
              value={slug}
              InputProps={{
                readOnly: true,
              }}
            />

            <RHFSelect
              name="productType"
              label="Product Type"
              value={productType}
              onChange={handleProductTypeChange}>
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAttributes = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Attributes
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Product attributes and variations
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Attributes" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {productType === "variable" && (
              <>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Select Attributes
                  </Typography>

                  {attributesLoading ? (
                    <Typography>Loading attributes...</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {attributes.map((attribute) => (
                        <Box
                          key={attribute._id}
                          sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: "primary.main",
                            },
                          }}
                          onClick={() => handleAttributeSelect(attribute)}>
                          <Typography variant="subtitle2">
                            {attribute.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Values:{" "}
                            {attribute.values.map((v) => v.name).join(", ")}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>

                {selectedAttributes.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Selected Attributes
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap>
                      {selectedAttributes.map((attribute) => (
                        <Chip
                          key={attribute._id}
                          label={attribute.name}
                          onDelete={() => handleAttributeRemove(attribute._id)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={generateVariations}
                      disabled={generatingVariations}
                      sx={{ mt: 2 }}>
                      {generatingVariations
                        ? "Generating..."
                        : "Generate Variations"}
                    </Button>
                  </Box>
                )}

                {variations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Variations ({variations.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setVariationsDialogOpen(true)}>
                      Edit Variations
                    </Button>
                  </Box>
                )}
              </>
            )}

            <RHFSelect
              name="category"
              label="Category"
              InputLabelProps={{ shrink: true }}
              disabled={categoriesLoading}>
              <MenuItem value="" disabled>
                {categoriesLoading ? "Loading..." : "Select category"}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </RHFSelect>
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
            {productType === "simple" ? (
              <>
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
              </>
            ) : (
              <Alert severity="info">
                Pricing will be set for individual variations after generating
                them.
              </Alert>
            )}
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
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
          {renderAttributes}
          {renderPricing}
          {renderActions}
        </Grid>
      </FormProvider>

      {/* Variations Dialog */}
      <Dialog
        open={variationsDialogOpen}
        onClose={() => setVariationsDialogOpen(false)}
        maxWidth="lg"
        fullWidth>
        <DialogTitle>Edit Variations</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {variations.map((variation, index) => (
              <Card key={variation.id} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    Variation {index + 1}:{" "}
                    {Object.values(variation.attributes).join(" - ")}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Regular Price"
                        type="number"
                        value={variation.regularPrice}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].regularPrice = Number(
                            e.target.value
                          );
                          setVariations(newVariations);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                component="span"
                                sx={{ color: "text.disabled" }}>
                                R.S
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Sale Price"
                        type="number"
                        value={variation.salePrice}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].salePrice = Number(
                            e.target.value
                          );
                          setVariations(newVariations);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                component="span"
                                sx={{ color: "text.disabled" }}>
                                R.S
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Stock"
                        type="number"
                        value={variation.stock}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].stock = Number(e.target.value);
                          setVariations(newVariations);
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="SKU"
                        value={variation.sku}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].sku = e.target.value;
                          setVariations(newVariations);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariationsDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveVariations} variant="contained">
            Save Variations
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
