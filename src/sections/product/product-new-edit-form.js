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
import { Upload } from "src/components/upload";

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

// Utility function to generate unique SKU
function generateSKU(name, type = "simple") {
  const prefix = type === "simple" ? "PROD" : "VAR";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const namePart = name ? name.substring(0, 3).toUpperCase() : "XXX";
  return `${prefix}-${namePart}-${timestamp}-${random}`;
}

// Product type options
const PRODUCT_TYPE_OPTIONS = [
  { value: "simple", label: "Simple Product" },
  { value: "variable", label: "Variable Product" },
];

// ----------------------------------------------------------------------

export default function ProductNewEditForm({
  isEdit,
  currentProduct,
  onSubmit: externalSubmit,
}) {
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

  // State for additional product properties
  const [stockQuantity, setStockQuantity] = useState(
    currentProduct?.stockQuantity || 0
  );
  const [stockStatus, setStockStatus] = useState(
    currentProduct?.stockStatus || "instock"
  );
  const [sku, setSku] = useState(currentProduct?.sku || "");
  const [weight, setWeight] = useState(currentProduct?.weight || 0);
  const [dimensions, setDimensions] = useState({
    length: currentProduct?.dimensions?.length || 0,
    width: currentProduct?.dimensions?.width || 0,
    height: currentProduct?.dimensions?.height || 0,
  });
  const [metaTitle, setMetaTitle] = useState(currentProduct?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    currentProduct?.metaDescription || ""
  );

  // State for product images
  const [images, setImages] = useState(currentProduct?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Helper function to extract category ID
  const getCategoryId = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (typeof category === "object") {
      return category._id || category.id || "";
    }
    return "";
  };

  // Fetch categories on mount
  useEffect(() => {
    setCategoriesLoading(true);
    CategoryService.getAll()
      .then((res) => {
        if (res?.data) {
          setCategories(res.data);
        } else if (res?.categories) {
          setCategories(res.categories);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch attributes on mount
  useEffect(() => {
    setAttributesLoading(true);
    AttributeService.getAll()
      .then((res) => {
        if (res?.data) {
          setAttributes(res.data);
        } else if (res?.attributes) {
          setAttributes(res.attributes);
        } else {
          setAttributes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching attributes:", error);
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
   
    regularPrice: Yup.number().when("productType", {
      is: (val) => val === "simple",
      then: (schema) =>
        schema
          .moreThan(0, "Regular price is required")
          .required("Regular price is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    salePrice: Yup.number(),
    category: Yup.string().required("Category is required"),
    sku: Yup.string().nullable(),
    stockQuantity: Yup.number()
      .min(0, "Stock quantity cannot be negative")
      .nullable(),
    
  
  });

  const defaultValues = useMemo(() => {
    if (!currentProduct) {
      return {
        name: "",
        slug: "",
        description: "",
        productType: "simple",
        price: 0,
        regularPrice: 0,
        salePrice: 0,
        category: "",
        sku: "",
        stockQuantity: 0,
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        metaTitle: "",
        metaDescription: "",
      };
    }

    // If we have currentProduct, use its values
    return {
      name: currentProduct.name,
      slug: currentProduct.slug,
      description: currentProduct.description,
      productType: currentProduct.type || "simple",
      price: currentProduct.price || 0,
      regularPrice: currentProduct.regularPrice || 0,
      salePrice: currentProduct.salePrice || 0,
      category: getCategoryId(currentProduct.categories?.[0]) || "",
      sku: currentProduct.sku || "",
      stockQuantity: currentProduct.stockQuantity || 0,
      weight: currentProduct.weight || 0,
      dimensions: {
        length: currentProduct.dimensions?.length || 0,
        width: currentProduct.dimensions?.width || 0,
        height: currentProduct.dimensions?.height || 0,
      },
      metaTitle: currentProduct.metaTitle || "",
      metaDescription: currentProduct.metaDescription || "",
    };
  }, [currentProduct]);

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    mode: "onBlur",
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
      console.log("Setting form values from currentProduct:", currentProduct);

      // Create the form values object
      const formValues = {
        name: currentProduct.name || "",
        slug: currentProduct.slug || "",
        description: currentProduct.description || "",
        productType: currentProduct.type || "simple",
        price: currentProduct.price || 0,
        regularPrice: currentProduct.regularPrice || 0,
        salePrice: currentProduct.salePrice || 0,
        category: getCategoryId(currentProduct.categories?.[0]) || "",
        sku: currentProduct.sku || "",
        stockQuantity: currentProduct.stockQuantity || 0,
        weight: currentProduct.weight || 0,
        dimensions: {
          length: currentProduct.dimensions?.length || 0,
          width: currentProduct.dimensions?.width || 0,
          height: currentProduct.dimensions?.height || 0,
        },
        metaTitle: currentProduct.metaTitle || "",
        metaDescription: currentProduct.metaDescription || "",
      };

      console.log("Form values being set:", formValues);

      // Reset the form with the current product values
      reset(formValues);

      // Set local state values
      setSlug(currentProduct?.slug || "");
      setProductType(currentProduct?.type || "simple");

      // Set selected attributes from current product
      if (currentProduct?.attributes) {
        setSelectedAttributes(currentProduct.attributes);
      }

      // Set variations from current product
      if (currentProduct?.variations) {
        setVariations(currentProduct.variations);
      }

      // Set additional product properties
      setStockQuantity(currentProduct?.stockQuantity || 0);
      setStockStatus(currentProduct?.stockStatus || "instock");
      setSku(currentProduct?.sku || "");
      setWeight(currentProduct?.weight || 0);
      setDimensions({
        length: currentProduct?.dimensions?.length || 0,
        width: currentProduct?.dimensions?.width || 0,
        height: currentProduct?.dimensions?.height || 0,
      });
      setMetaTitle(currentProduct?.metaTitle || "");
      setMetaDescription(currentProduct?.metaDescription || "");

      // Set images from current product
      if (currentProduct?.images) {
        setImages(currentProduct.images);
        // Set primary image index to 0 (first image)
        setPrimaryImageIndex(0);
      }
    }
  }, [currentProduct, reset]);

  // Handle product type change
  const handleProductTypeChange = (event) => {
    if (!event || !event.target) {
      console.error("Invalid event:", event);
      return;
    }

    const newType = event.target.value;
    if (!newType) {
      console.error("Invalid product type:", newType);
      return;
    }

    setProductType(newType);
    setValue("productType", newType);

    // Reset pricing for variable products
    if (newType === "variable") {
      setValue("price", 0);
      setValue("regularPrice", 0);
      setValue("salePrice", 0);

      // Clear existing variations when switching to variable
      setVariations([]);
      setSelectedAttributes([]);

      enqueueSnackbar(
        "Switched to variable product. Please select attributes and generate variations.",
        {
          variant: "info",
        }
      );
    }
  };

  // Handle attribute selection
  const handleAttributeSelect = (attribute) => {
    if (!attribute || !attribute._id) {
      console.error("Invalid attribute:", attribute);
      return;
    }

    const isSelected = selectedAttributes.find(
      (attr) => attr?._id === attribute._id
    );
    if (!isSelected) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  // Handle attribute removal
  const handleAttributeRemove = (attributeId) => {
    if (!attributeId) {
      console.error("Invalid attribute ID:", attributeId);
      return;
    }

    setSelectedAttributes(
      selectedAttributes.filter((attr) => attr?._id !== attributeId)
    );
  };

  // Handle image upload
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Check maximum image limit (10 images max)
    const maxImages = 10;
    if (images.length + files.length > maxImages) {
      enqueueSnackbar(
        `Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more image(s).`,
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      setUploadingImages(true);

      // Create FormData for image upload
      const formData = new FormData();
      files.forEach((file) => {
        if (typeof file === "object" && file instanceof File) {
          formData.append("images", file);
        }
      });

      // Upload images using ProductService
      const response = await ProductService.uploadImage(formData);

      // Handle different possible response structures
      let imageUrls = [];
      if (response?.imageUrls && Array.isArray(response.imageUrls)) {
        // API returns { message: "...", imageUrls: [...] }
        imageUrls = response.imageUrls;
      } else if (response?.success && response?.urls) {
        imageUrls = response.urls;
      } else if (response?.data?.urls) {
        imageUrls = response.data.urls;
      } else if (response?.urls) {
        imageUrls = response.urls;
      } else if (Array.isArray(response)) {
        imageUrls = response;
      } else {
        throw new Error(
          response?.message || "Failed to upload images - no URLs returned"
        );
      }

      if (imageUrls.length > 0) {
        // Filter out any duplicate URLs and add new image URLs to existing images
        const existingUrls = new Set(images);
        const uniqueNewUrls = imageUrls.filter((url) => !existingUrls.has(url));

        if (uniqueNewUrls.length > 0) {
          const newImages = [...images, ...uniqueNewUrls];
          setImages(newImages);
          enqueueSnackbar(
            `Successfully uploaded ${uniqueNewUrls.length} new image(s)!`,
            { variant: "success" }
          );
        } else {
          enqueueSnackbar("All uploaded images already exist in the gallery.", {
            variant: "info",
          });
        }
      } else {
        throw new Error("No image URLs returned from upload");
      }
    } catch (error) {
      console.error("Error uploading images:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to upload images. Please try again.";
      if (error?.response?.status === 413) {
        errorMessage = "File size too large. Please use images under 5MB.";
      } else if (error?.response?.status === 415) {
        errorMessage =
          "Unsupported file type. Please use PNG, JPG, JPEG, or WebP.";
      } else if (error?.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle image removal
  const handleImageRemove = (imageToRemove) => {
    const updatedImages = images.filter((image) => image !== imageToRemove);
    setImages(updatedImages);
  };

  // Handle remove all images
  const handleRemoveAllImages = () => {
    setImages([]);
  };

  // Validate image URLs
  const validateImageUrls = (urls) => {
    if (!Array.isArray(urls)) return false;
    return urls.every(
      (url) => typeof url === "string" && url.trim().length > 0
    );
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    if (index >= 0 && index < images.length) {
      setPrimaryImageIndex(index);
      // Move primary image to first position
      const newImages = [...images];
      const [primaryImage] = newImages.splice(index, 1);
      newImages.unshift(primaryImage);
      setImages(newImages);
      setPrimaryImageIndex(0);
      enqueueSnackbar("Primary image updated!", { variant: "success" });
    }
  };

  // Generate variations from selected attributes
  const generateVariations = () => {
    if (!selectedAttributes || selectedAttributes.length === 0) {
      enqueueSnackbar("Please select at least one attribute", {
        variant: "warning",
      });
      return;
    }

    setGeneratingVariations(true);

    try {
      // Generate all possible combinations
      const generateCombinations = (attributes, index = 0, current = {}) => {
        if (index === attributes.length) {
          return [current];
        }

        const attribute = attributes[index];
        if (!attribute || !attribute.values) {
          console.error("Invalid attribute structure:", attribute);
          return [current];
        }

        const combinations = [];

        attribute.values.forEach((value) => {
          if (value && value.name) {
            const newCombination = { ...current, [attribute.name]: value.name };
            combinations.push(
              ...generateCombinations(attributes, index + 1, newCombination)
            );
          }
        });

        return combinations;
      };

      const combinations = generateCombinations(selectedAttributes);
      const newVariations = combinations.map((combination, index) => ({
        id: `temp-${index}`,
        attributes: combination || {},
        price: 0, // This will be calculated from regularPrice or salePrice
        regularPrice: 10, // Set a default regular price
        salePrice: 0,
        stock: 1, // Set a default stock
        sku: `VAR-${Date.now()}-${index}`,
      }));

      setVariations(newVariations);
      setVariationsDialogOpen(true);
    } catch (error) {
      console.error("Error generating variations:", error);
      enqueueSnackbar("Error generating variations. Please try again.", {
        variant: "error",
      });
    } finally {
      setGeneratingVariations(false);
    }
  };

  // Helper to calculate effective price for variations
  const calculateEffectivePrice = (regularPrice, salePrice) => {
    const regPrice = Number(regularPrice) || 0;
    const salePriceNum = Number(salePrice) || 0;
    return salePriceNum > 0 ? salePriceNum : regPrice;
  };

  // Save variations
  const saveVariations = () => {
    // Safety check for variations array
    if (!variations || variations.length === 0) {
      enqueueSnackbar("No variations to save", { variant: "warning" });
      return;
    }

    // Validate variations - check for required fields
    const invalidVariations = variations.filter(
      (v) =>
        !v?.regularPrice ||
        v.regularPrice <= 0 ||
        !v?.stock ||
        v.stock < 0 ||
        !v?.sku
    );

    if (invalidVariations.length > 0) {
      const invalidCount = invalidVariations.length;
      const missingPrice = invalidVariations.filter(
        (v) => !v.regularPrice || v.regularPrice <= 0
      ).length;
      const missingStock = invalidVariations.filter(
        (v) => !v.stock || v.stock < 0
      ).length;
      const missingSku = invalidVariations.filter((v) => !v.sku).length;

      let message = `${invalidCount} variation(s) have issues: `;
      if (missingPrice > 0)
        message += `${missingPrice} missing valid pricing, `;
      if (missingStock > 0) message += `${missingStock} missing valid stock, `;
      if (missingSku > 0) message += `${missingSku} missing SKU, `;
      message = message.slice(0, -2); // Remove trailing comma and space

      enqueueSnackbar(message, { variant: "error" });
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
    if (!selectedAttributes || selectedAttributes.length === 0) {
      return [];
    }

    return selectedAttributes
      .filter((attr) => attr && attr.name && attr.values)
      .map((attr) => ({
        name: attr.name,
        values: attr.values,
        isVariationAttribute: true,
      }));
  };

  // Helper to get product summary for variable products
  const getProductSummary = () => {
    if (productType !== "variable" || !variations || variations.length === 0) {
      return null;
    }

    try {
      const prices = variations
        .map((v) => v?.regularPrice || 0)
        .filter((p) => p > 0);

      const totalStock = variations.reduce(
        (sum, v) => sum + (v?.stock || 0),
        0
      );

      return {
        totalVariations: variations.length,
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        totalStock,
      };
    } catch (error) {
      console.error("Error calculating product summary:", error);
      return {
        totalVariations: variations.length,
        minPrice: 0,
        maxPrice: 0,
        totalStock: 0,
      };
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted with data:", data);

      if (isEdit && externalSubmit) {
        console.log("Submitting edit form with data:", data);
        
        const editData = {
          ...data,
          type: data.productType,
          categories: data.category ? [data.category] : [],
          price: Number(data.price) || 0,
          regularPrice: Number(data.regularPrice) || 0,
          salePrice: Number(data.salePrice) || 0,
          stockQuantity: Number(data.stockQuantity) || 0,
          weight: Number(data.weight) || 0,
          dimensions: {
            length: Number(data.dimensions?.length) || 0,
            width: Number(data.dimensions?.width) || 0,
            height: Number(data.dimensions?.height) || 0,
          },
          // Include additional fields that might not be in the form
          stockStatus: stockStatus,
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          // Ensure images is an array
          images: Array.isArray(images) ? images : (images ? [images] : []),
        };

        console.log("Final edit data being submitted:", editData);
        await externalSubmit(editData);
        return;
      }
      // For variable products, ensure variations exist and have valid pricing
      if (data.productType === "variable") {
        if (!variations || variations.length === 0) {
          enqueueSnackbar(
            "Variable products must have variations. Please generate variations first.",
            {
              variant: "warning",
            }
          );
          return;
        }

        // Check if all variations have valid pricing, stock, and SKU
        const invalidVariations = variations.filter(
          (v) =>
            !v.regularPrice ||
            v.regularPrice <= 0 ||
            !v.stock ||
            v.stock < 0 ||
            !v.sku
        );
        if (invalidVariations.length > 0) {
          enqueueSnackbar(
            `${invalidVariations.length} variation(s) have invalid data. Please fix all variations before submitting.`,
            { variant: "error" }
          );
          return;
        }
      }

      // Check if images are uploaded (recommended but not required)
      if (!images || images.length === 0) {
        const shouldContinue = window.confirm(
          "No images uploaded. Products without images may not display properly. Continue anyway?"
        );
        if (!shouldContinue) {
          return;
        }
      }

      // Build request body according to API documentation
      const body = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.productType,
        status: "published", // Default status for new products
      };

      // Handle categories - API expects array of category IDs
      if (data.category) {
        body.categories = [data.category];
      } else if (data.categories && Array.isArray(data.categories)) {
        body.categories = data.categories;
      }

      // Add SKU if provided
      if (data.sku) {
        body.sku = data.sku;
      } else {
        // Auto-generate SKU if none provided
        body.sku = generateSKU(data.name, data.productType);
      }

      // Add stock information
      body.stockQuantity = Number(data.stockQuantity) || 0;
      body.stockStatus = data.stockStatus || "instock";

      // Add physical properties
      if (data.weight > 0) {
        body.weight = Number(data.weight);
      }
      if (
        data.dimensions.length > 0 ||
        data.dimensions.width > 0 ||
        data.dimensions.height > 0
      ) {
        body.dimensions = {
          length: Number(data.dimensions.length) || 0,
          width: Number(data.dimensions.width) || 0,
          height: Number(data.dimensions.height) || 0,
        };
      }

      // Add SEO fields
      if (data.metaTitle) {
        body.metaTitle = data.metaTitle;
      }
      if (data.metaDescription) {
        body.metaDescription = data.metaDescription;
      }

      // Add images if any
      if (images && images.length > 0) {
        if (validateImageUrls(images)) {
          body.images = images;
          console.log("Adding images to product:", images);
        } else {
          console.warn("Invalid image URLs detected, skipping images");
        }
      } else if (data.images && Array.isArray(data.images)) {
        // Handle images from form data
        if (validateImageUrls(data.images)) {
          body.images = data.images;
          console.log("Adding images from form data:", data.images);
        } else {
          console.warn("Invalid image URLs detected in form data, skipping images");
        }
      }

      // Add pricing based on product type
      if (data.productType === "simple") {
        // For simple products, set the main price fields
        body.price = Number(data.price);
        body.regularPrice = Number(data.regularPrice);
        if (data.salePrice && Number(data.salePrice) > 0) {
          body.salePrice = Number(data.salePrice);
        }
      } else {
        // For variable products, we need to handle this differently
        // The API expects either base pricing OR variations with individual pricing
        if (selectedAttributes.length > 0) {
          body.attributes = selectedAttributes.map((attr) => ({
            name: attr.name,
            values: attr.values.map((val) => val.name),
            isVariationAttribute: true,
          }));
        }

        // For variable products, we'll set a base price that represents the starting price
        // This will be overridden by individual variation prices
        if (variations && variations.length > 0) {
          // Calculate base price from variations (minimum price)
          try {
            const prices = variations
              .map((v) => v?.regularPrice || 0)
              .filter((p) => p > 0);
            if (prices.length > 0) {
              const minPrice = Math.min(...prices);
              body.price = minPrice;
              body.regularPrice = minPrice;
            } else {
              body.price = 0;
              body.regularPrice = 0;
            }
          } catch (error) {
            console.error(
              "Error calculating base price from variations:",
              error
            );
            body.price = 0;
            body.regularPrice = 0;
          }
        } else {
          // If no variations yet, set a default base price
          body.price = 0;
          body.regularPrice = 0;
        }
      }

      if (!currentProduct) {
        // Create product using ProductService
        console.log("Creating product with payload:", body);
        const response = await ProductService.create(body);

        // Debug: Log the complete response structure
        console.log("Product creation response:", response);
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response || {}));

        // Handle different API response structures
        let productId;
        if (response?.product?._id) {
          // API returns { message: "...", product: { _id: "..." } }
          productId = response.product._id;
          console.log("Found product ID in response.product._id:", productId);
        } else if (response?.id) {
          // API returns { id: "..." }
          productId = response.id;
          console.log("Found product ID in response.id:", productId);
        } else if (response?._id) {
          // API returns { _id: "..." }
          productId = response._id;
          console.log("Found product ID in response._id:", productId);
        } else if (response?.data?._id) {
          // API returns { data: { _id: "..." } }
          productId = response.data._id;
          console.log("Found product ID in response.data._id:", productId);
        } else {
          console.error("No product ID found in response:", response);
          throw new Error("Failed to create product - no ID returned");
        }

        // If it's a variable product and we have variations, create them
        if (data.productType === "variable" && variations.length > 0) {
          console.log("Creating variations for product:", productId);

          for (const variation of variations) {
            const variationPayload = {
              sku:
                variation?.sku ||
                `VAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              price: calculateEffectivePrice(
                variation?.regularPrice || 0,
                variation?.salePrice || 0
              ),
              regularPrice: variation?.regularPrice || 0,
              salePrice: variation?.salePrice > 0 ? variation.salePrice : 0,
              stock: variation?.stock || 0,
              attributeValues: variation?.attributes
                ? Object.entries(variation.attributes).map(([name, value]) => ({
                    name,
                    value,
                  }))
                : [],
            };

            console.log("Creating variation with payload:", variationPayload);
            await ProductService.createVariation(productId, variationPayload);
          }
        }

        reset();
        enqueueSnackbar("Product created successfully!", {
          variant: "success",
        });
        router.push(paths.dashboard.product.root);
      } else {
        // Update existing product
        const productId = currentProduct.id || currentProduct._id;
        console.log("Updating product with payload:", body);

        await ProductService.update(productId, body);

        // If it's a variable product, update variations
        if (data.productType === "variable" && variations.length > 0) {
          // Note: For updates, you might want to delete existing variations and recreate them
          // or implement a more sophisticated update logic
          console.log(
            "Product updated. Variations would need to be updated separately."
          );
        }

        enqueueSnackbar("Product updated successfully!", {
          variant: "success",
        });
        router.push(paths.dashboard.product.root);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

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

  const renderImages = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Images
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Product images and gallery
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Images" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Product Images ({images.length}/10)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload product images. You can upload multiple images to create
                a product gallery. Maximum 10 images allowed.
              </Typography>

              <Upload
                multiple
                thumbnail
                files={images}
                onDrop={handleImageUpload}
                onRemove={handleImageRemove}
                onRemoveAll={handleRemoveAllImages}
                disabled={uploadingImages || images.length >= 10}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                }}
                maxSize={5242880} // 5MB
                helperText={
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: PNG, JPG, JPEG, WebP. Max size: 5MB per
                    image.
                  </Typography>
                }
              />

              {uploadingImages && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Uploading images... Please wait.
                </Alert>
              )}

              {images.length >= 10 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Maximum number of images (10) reached. Remove some images
                  before uploading more.
                </Alert>
              )}

              {images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Image Gallery ({images.length} images)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    First image will be the primary product image. Drag to
                    reorder or click to set as primary.
                  </Typography>
                </Box>
              )}
            </Box>
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

                {productType === "variable" && variations.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Variable products must have variations before they can be
                    created. Please select attributes and generate variations
                    first.
                  </Alert>
                )}

                {productType === "variable" && variations.length > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "success.lighter",
                      borderRadius: 1,
                    }}>
                    <Typography
                      variant="subtitle2"
                      color="success.dark"
                      sx={{ mb: 1 }}>
                      Product Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total Variations
                        </Typography>
                        <Typography variant="body2">
                          {getProductSummary()?.totalVariations || 0}
                        </Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Price Range
                        </Typography>
                        <Typography variant="body2">
                          R.S {getProductSummary()?.minPrice || 0} - R.S{" "}
                          {getProductSummary()?.maxPrice || 0}
                        </Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total Stock
                        </Typography>
                        <Typography variant="body2">
                          {getProductSummary()?.totalStock || 0}
                        </Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Ready to Create
                        </Typography>
                      </Grid>
                    </Grid>
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
                <MenuItem
                  key={category.id || category._id}
                  value={category.id || category._id}>
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

                {/* <RHFTextField
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
                /> */}

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
                For variable products, pricing is set per variation. The base
                price will be automatically calculated from your variations.
              </Alert>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderInventory = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Inventory & Shipping
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Stock management and physical properties
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Inventory & Shipping" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Stack direction="row" spacing={1}>
                  <RHFTextField
                    name="sku"
                    label="SKU"
                    placeholder="Product SKU"
                    helperText="Stock Keeping Unit - unique identifier"
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const generatedSKU = generateSKU(
                        values.name,
                        values.productType
                      );
                      setValue("sku", generatedSKU);
                      setSku(generatedSKU);
                    }}
                    sx={{ minWidth: "auto", px: 1 }}
                    title="Generate new SKU">
                    <Iconify icon="mdi:refresh" width={16} />
                  </Button>
                </Stack>
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFTextField
                  name="stockQuantity"
                  label="Stock Quantity"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  helperText="Available quantity in stock"
                />
              </Grid>
            </Grid>

            <RHFSelect
              name="stockStatus"
              label="Stock Status"
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}>
              <MenuItem value="instock">In Stock</MenuItem>
              <MenuItem value="outofstock">Out of Stock</MenuItem>
              <MenuItem value="onbackorder">On Backorder</MenuItem>
            </RHFSelect>

            <Divider />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Physical Properties
            </Typography>

            <Grid container spacing={2}>
              <Grid xs={12} sm={4}>
                <RHFTextField
                  name="weight"
                  label="Weight (kg)"
                  placeholder="0.00"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  helperText="Product weight in kilograms"
                />
              </Grid>
              <Grid xs={12} sm={8}>
                <Typography variant="caption" color="text.secondary">
                  Dimensions (cm)
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid xs={4}>
                    <RHFTextField
                      name="dimensions.length"
                      label="Length"
                      placeholder="0"
                      type="number"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <RHFTextField
                      name="dimensions.width"
                      label="Width"
                      placeholder="0"
                      type="number"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <RHFTextField
                      name="dimensions.height"
                      label="Height"
                      placeholder="0"
                      type="number"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderSEO = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            SEO & Meta
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Search engine optimization
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="SEO & Meta" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="metaTitle"
              label="Meta Title"
              placeholder="Product meta title for SEO"
              helperText="Recommended: 50-60 characters"
              inputProps={{ maxLength: 60 }}
            />

            <RHFTextField
              name="metaDescription"
              label="Meta Description"
              placeholder="Product meta description for SEO"
              multiline
              rows={3}
              helperText="Recommended: 150-160 characters"
              inputProps={{ maxLength: 160 }}
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
          loading={isSubmitting}
          disabled={productType === "variable" && variations.length === 0}
          sx={{
            bgcolor: "#4CAF50",
            "&:hover": {
              bgcolor: "#45a049",
            },
          }}>
          {!currentProduct ? "Create Product" : "Save Changes"}
        </LoadingButton>

        {productType === "variable" && variations.length === 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}>
            Variable products require variations before they can be created.
            Please generate variations first.
          </Typography>
        )}
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {renderDetails}
          {renderImages}
          {renderAttributes}
          {renderPricing}
          {renderInventory}
          {renderSEO}
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
          <Alert severity="info" sx={{ mb: 2 }}>
            Set pricing and stock information for each variation. Regular Price
            is required for all variations.
          </Alert>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {variations.map((variation, index) => (
              <Card key={variation.id} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    Variation {index + 1}:{" "}
                    {variation?.attributes
                      ? Object.values(variation.attributes).join(" - ")
                      : "No attributes"}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Regular Price *"
                        type="number"
                        value={variation.regularPrice}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].regularPrice = Number(
                            e.target.value
                          );
                          setVariations(newVariations);
                        }}
                        error={
                          !variation.regularPrice || variation.regularPrice <= 0
                        }
                        helperText={
                          !variation.regularPrice || variation.regularPrice <= 0
                            ? "Required"
                            : ""
                        }
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
                        label="Stock *"
                        type="number"
                        value={variation.stock}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].stock = Number(e.target.value);
                          setVariations(newVariations);
                        }}
                        error={!variation.stock || variation.stock < 0}
                        helperText={
                          !variation.stock || variation.stock < 0
                            ? "Required (min: 0)"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="SKU *"
                        value={variation.sku}
                        onChange={(e) => {
                          const newVariations = [...variations];
                          newVariations[index].sku = e.target.value;
                          setVariations(newVariations);
                        }}
                        error={!variation.sku}
                        helperText={!variation.sku ? "Required" : ""}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ p: 2, bgcolor: "background.neutral", borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Variations: {variations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price Range: R.S{" "}
                {variations.length > 0
                  ? Math.min(...variations.map((v) => v?.regularPrice || 0))
                  : 0}{" "}
                - R.S{" "}
                {variations.length > 0
                  ? Math.max(...variations.map((v) => v?.regularPrice || 0))
                  : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Stock:{" "}
                {variations.reduce((sum, v) => sum + (v?.stock || 0), 0)}
              </Typography>
            </Box>
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
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  onSubmit: PropTypes.func,
};
