"use client";
import PropTypes from "prop-types";
import { useEffect, useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { formHelperTextClasses } from "@mui/material/FormHelperText";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { fCurrency, fShortenNumber } from "src/utils/format-number";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ColorPicker } from "src/components/color-utils";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import SocialShare from "src/components/social-share";

import IncrementerButton from "./common/incrementer-button";
import CheckAvailabiltyForm from "./check-availabilty-form";
import { Chip } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuthContext } from "src/auth/hooks";
import { UserService } from "src/services";
import { useSnackbar } from "src/components/snackbar";
import { ACCESS_TOKEN_KEY } from "src/utils/constants";
import { useCheckoutContext } from "../checkout/context";

// ----------------------------------------------------------------------

export default function ShopDetailSummary({
  items,
  product,
  //   onAddCart,
  //   onGotoStep,
  disabledActions,
  ...other
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    id,
    _id, // Add _id for new API structure
    name,
    title, // Keep title for backward compatibility
    sizes = [],
    price,
    regularPrice,
    carDetails,
    salePrice,
    coverUrl,
    images, // Add images for new API structure
    colors,
    newLabel = {},
    available,
    saleLabel = {},
    ratingCount,
    totalReviews,
    inventoryType,
    stockStatus, // Add stockStatus for new API structure
    subDescription,
    categories, // Add categories for new API structure
    category, // Keep category for backward compatibility
    productStatus, // Renamed from status to avoid conflict

    productAvailable,
    postalCode,
    location,
  } = product;

  // Get the product ID, handling both old and new API structures
  const productId = _id || id;

  const { onAddToCart, onGotoStep, update, onClearCart } = useCheckoutContext();

  // Get the product name, handling both old and new API structures
  const productName = name || title || "Product";

  // Get the product images, handling both old and new API structures
  const productImages = images || [];
  const firstImage = productImages[0] || coverUrl || "/assets/placeholder.svg";

  // Get the product category, handling both old and new API structures
  const productCategory =
    category ||
    (categories && categories.length > 0 ? categories[0].name : "sale");

  // Get the product stock status, handling both old and new API structures
  const productStockStatus = stockStatus || inventoryType || "in stock";

  // Get the product status, handling both old and new API structures
  const productStatusValue = productStatus || "published";

  const existProduct =
    !!items?.length && items.map((item) => item.id).includes(productId);

  const isMaxQuantity =
    !!items?.length &&
    items
      .filter((item) => item.id === productId)
      .map((item) => item.quantity)[0] >= available;

  // --- Add react-hook-form for quantity state ---
  const defaultValues = {
    quantity: 1,
    size: sizes[0] || "",
    colors: colors && colors.length > 0 ? colors[0] : "",
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    watch,
    setValue,
    reset,
    control,
    // handleSubmit,
    // formState: { errors },
  } = methods;

  const values = watch();

  // Favorite functionality
  const [isFavorite, setIsFavorite] = useState(false);
  const { user = {} } = useAuthContext()?.user || {};
  const { updateUserData = () => {} } = useAuthContext() || {};

  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // Test UserService availability
  console.log("UserService available:", !!UserService);
  console.log(
    "UserService.addOrRemoveFavoriteProduct available:",
    !!UserService?.addOrRemoveFavoriteProduct
  );

  // Debug user context
  console.log("useAuthContext():", useAuthContext());
  console.log("user from context:", user);

  // Check if product is in favorites when component mounts or when user/product changes
  useEffect(() => {
    let isMounted = true;

    const checkFavoriteStatus = async () => {
      try {
        const actualUser = user?.user || user;
        if (!actualUser?._id) return;

        const userId = actualUser._id;

        const result = await UserService.getUserFavoriteProducts({
          userId: userId,
        });

        // Only update state if component is still mounted
        if (isMounted && result?.status === 200 && result?.data?.data) {
          const favorites = result.data.data;
          const productToCheck = product?._id || product?.id;
          const isProductFavorite = favorites.some(
            (fav) =>
              fav._id === productToCheck ||
              fav._id.toString() === productToCheck?.toString()
          );
          setIsFavorite(isProductFavorite);
        }
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavoriteStatus();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user?.user?._id, product?._id, product?.id]);

  const handleCopyUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      enqueueSnackbar("URL copied to clipboard!", { variant: "success" });
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        enqueueSnackbar("URL copied to clipboard!", { variant: "success" });
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        enqueueSnackbar("Failed to copy URL", { variant: "error" });
      }
    }
  };

  const handleAddOrRemoveFav = async (e) => {
    console.log("handleAddOrRemoveFav called"); // Debug log
    try {
      e.preventDefault();
      e.stopPropagation();

      // Get the actual user data from the nested structure
      const actualUser = user?.user || user;
      console.log("actualUser:", actualUser); // Debug log

      if (!actualUser?._id) {
        console.error("User not logged in - Please log in to add favorites");
        enqueueSnackbar("Please log in to add favorites", {
          variant: "warning",
        });
        return;
      }

      // Check if we have a valid token
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        console.error("No access token found");
        enqueueSnackbar("Authentication token missing. Please log in again.", {
          variant: "warning",
        });
        return;
      }

      const userId = actualUser._id;
      const productId = product?._id || product?.id;

      console.log("userId:", userId, "productId:", productId); // Debug log

      if (!productId) {
        console.error("Invalid product ID");
        enqueueSnackbar("Invalid product ID", { variant: "error" });
        return;
      }

      if (!userId) {
        console.error("Invalid user ID");
        enqueueSnackbar("Invalid user ID", { variant: "error" });
        return;
      }

      const data = {
        userID: userId,
        productID: productId,
      };

      console.log("Sending favorite request with data:", data); // Debug log

      // Optimistically update UI
      setIsFavorite((prev) => !prev);

      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const result = await Promise.race([
        UserService.addOrRemoveFavoriteProduct(data),
        timeoutPromise,
      ]);
      console.log("API result:", result); // Debug log

      if (result?.status === 200 && result?.data?.success) {
        // Update user data with the new favorite list
        updateUserData(result.data);
        console.log("Favorite updated:", result.data);
        enqueueSnackbar(
          isFavorite ? "Removed from favorites" : "Added to favorites",
          { variant: "success" }
        );
      } else {
        // Revert UI if request failed
        setIsFavorite((prev) => !prev);
        console.error("Failed to update favorite:", result?.data?.message);
        enqueueSnackbar("Failed to update favorite", { variant: "error" });
      }
    } catch (err) {
      // Revert UI on error
      setIsFavorite((prev) => !prev);
      console.error("Error adding/removing favorite:", err);

      // Check if it's an authentication error
      if (err?.response?.status === 401) {
        enqueueSnackbar("Authentication error. Please log in again.", {
          variant: "error",
        });
      } else if (err?.response?.status === 403) {
        enqueueSnackbar("Access denied", { variant: "error" });
      } else {
        enqueueSnackbar("Failed to update favorite. Please try again.", {
          variant: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (product) {
      reset({
        quantity: 1,
        size: sizes[0] || "",
        colors: colors && colors.length > 0 ? colors[0] : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const DealStatus = ({ title, icon, color }) => {
    return (
      <Typography
        fontWeight={600}
        sx={{
          display: "flex",
          gap: "5px",
          color: color,
          justifyContent: "end",
          color: "#4CAF50",
        }}>
        <Iconify icon={icon} />
        {title}
      </Typography>
    );
  };

  const handleAddCart = async () => {
    const newProduct = {
      id: productId,
      name: productName,
      coverUrl: firstImage,
      available: productAvailable,
      price: salePrice,
      colors: colors && colors.length > 0 ? [colors[0]] : [],
      size: sizes && sizes.length > 0 ? sizes[0] : "Default",
      quantity: 1,
      carDetails: carDetails || {},
      category: categories,
      location: location,
      postalCode: postalCode,
    };
    try {
      onAddToCart(newProduct);
      console.log("Added to cart:", newProduct);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyNowLoading(true);
    // const newProduct = {
    //   id: productId,
    //   name: productName,
    //   coverUrl: firstImage,
    //   available: productAvailable,
    //   price: productPrice,
    //   colors: colors && colors.length > 0 ? [colors[0]] : [],
    //   size: sizes && sizes.length > 0 ? sizes[0] : "Default",
    //   quantity: 1,
    //   // Add car-specific properties if available
    //   carDetails: carDetails || {},
    //   category: productCategory,
    //   location: productLocation,
    //   postalCode: productPostalCode,
    // };
    try {
      // Clear cart first, then add the product to cart
      // onClearCart();
      // onAddToCart(newProduct);

      // Set the active step to 0 (cart step)
      // onGotoStep(0);

      // console.log("Buy now:", newProduct);
      // Small delay to ensure cart state is updated, then navigate to checkout
      handleAddCart();
      setTimeout(() => {
        router.push(paths.product.checkout);
      }, 100);
    } catch (error) {
      console.error("Error with buy now:", error);
      setIsBuyNowLoading(false);
    }
  };

  const dealStatus = useMemo(() => {
    if (product?.status) {
      switch (product?.deal) {
        case "fair":
          return (
            <DealStatus
              color="success.light"
              icon="entypo:price-tag"
              title="Fair Deal"
            />
          );
        case "great":
          return (
            <DealStatus
              color="success.light"
              icon="entypo:price-tag"
              title="Great Deal"
            />
          );
        case "good":
          return (
            <DealStatus
              color="primary.light"
              icon="entypo:price-tag"
              title="Good Deal"
            />
          );
        case "high":
          return (
            <DealStatus
              color="primary.main"
              icon="entypo:price-tag"
              title="High Priced"
            />
          );
        case "over":
          return (
            <DealStatus
              color="primary.main"
              icon="entypo:price-tag"
              title="Over Priced"
            />
          );
        case "no":
          return (
            <DealStatus
              color="gray"
              icon="entypo:price-tag"
              title="No Price Analysis"
            />
          );
      }
      return (
        <DealStatus
          color="gray"
          icon="entypo:price-tag"
          title="No Price Analysis"
        />
      );
    }
  }, [product?.status]);

  const renderPrice = (
    <>
      <Box
        sx={{
          width: "100%",
        }}>
        <Typography fontWeight={500} variant="h5" color="#4CAF50">
          {productName}
        </Typography>
        <Stack direction="row" alignItems="center" gap="5px">
          <Rating
            size="small"
            value={ratingCount}
            precision={0.1}
            readOnly
            sx={{
              mr: 1,
              "& .MuiRating-iconFilled": { color: "#4CAF50" },
              "& .MuiRating-iconHover": { color: "#4CAF50" },
              "& .MuiRating-iconEmpty": { color: "#e0e0e0" },
            }}
          />
          <Typography variant="body1" color="#fff">
            {ratingCount} star rating
          </Typography>
          <Typography variant="body1" color="#828282">
            (21,671 User feedback)
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          mt="16px">
          {/* Left Column */}
          <Stack gap={2} sx={{ flex: 1 }}>
            <Typography color="#828282" fontSize="14px">
              <span style={{ fontWeight: "500" }}>Sku:</span> {product.sku}
            </Typography>
            <Typography color="#828282" fontSize="14px">
              <span style={{ fontWeight: "500" }}>Brand:</span> Garage Tuned
              Autos
            </Typography>
          </Stack>

          {/* Right Column */}
          <Stack gap={2} sx={{ flex: 1, alignItems: "flex-end" }}>
            <Typography color="#4CAF50" fontSize="14px">
              <span style={{ fontWeight: "500", color: "#828282" }}>
                Availability:
              </span>{" "}
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Typography>
            <Typography color="#828282" fontSize="14px">
              <span style={{ fontWeight: "500" }}>Category:</span>{" "}
              {product.categories?.[0]?.name || "Car Care"}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          gap="6px"
          alignItems="center"
          width="100%"
          mt="16px">
          <Typography
            sx={{ display: "flex" }}
            alignItems="center"
            variant="h5"
            color="#4CAF50">
            PKR{salePrice ? Number(salePrice)?.toLocaleString() : 0}
          </Typography>
          <Typography
            color="#828282"
            fontSize="14px"
            variant="h5"
            sx={{
              textDecoration: "line-through",
              ml: 1,
              alignSelf: "center",
            }}>
            {product.regularPrice}
          </Typography>

          {(() => {
            const regularPrice =
              Number(product.regularPrice) || Number(product.price);
            const salePrice =
              Number(product.salePrice) || Number(product.price);
            const discountPercentage =
              regularPrice > salePrice
                ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                : 0;

            return discountPercentage > 0 ? (
              <Chip
                label={`${discountPercentage}% OFF`}
                sx={{
                  bgcolor: "#FFD700", // Bright yellow background
                  color: "#000", // Black text
                  fontWeight: "bold",
                  fontSize: "14px",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  border: "none",
                  boxShadow: "none",
                  "& .MuiChip-label": {
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#000",
                  },
                }}
              />
            ) : null;
          })()}
        </Stack>

        <Divider sx={{ borderColor: "#fff", mt: "16px" }} />
      </Box>
    </>
  );

  const renderContact = (
    <>
      <Box
        sx={{
          background: "#fff",
          border: "1px solid #c3cdd5",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          borderRadius: ".5rem",
          // borderColor: '#c3cdd5!important',
          width: "100%",
          padding: ".75rem 1rem",
        }}>
        {product?.saleAs && product?.companyOrSellerName && (
          <Typography fontWeight={700} variant="h5" color="#000">
            {product.saleAs} : {product.companyOrSellerName || "N/A"}
          </Typography>
        )}

        <Box mb={2} sx={{ display: "flex" }} justifyContent="space-between">
          <Link
            component="a"
            sx={{ display: "flex", color: "#000" }}
            gap={1}
            fontWeight="bold"
            alignItems="center"
            href={`tel:${product?.carDetails?.tel}`}>
            <Iconify icon="lucide:phone-call" />{" "}
            {product?.carDetails?.tel || "No Contact Available"}
          </Link>
        </Box>
        <Link
          sx={{
            display: "block",
            textAlign: "end",
          }}
          fontWeight={600}
          target="_blank"
          href={product?.link}
          color="#000">
          Watch Video
        </Link>
      </Box>
    </>
  );

  // Prepare share data for product details page
  const shareData = {
    title: productName,
    url: typeof window !== "undefined" ? window.location.href : "",
    description: `Check out this amazing ${productName} - Starting at PKR ${Number(price)?.toLocaleString()}`,
    image: firstImage,
    price: `PKR ${Number(price)?.toLocaleString()}`,
    hashtags: [productCategory, "Cars", "Automotive", "CityAutos"],
  };

  const renderShare = (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography
        variant="body2"
        sx={{
          color: "#666",
          fontWeight: "500",
          fontSize: "14px",
        }}>
        Share product:
      </Typography>

      <SocialShare {...shareData} size={32} sx={{ ml: 1 }} />
    </Stack>
  );

  const renderWishList = (
    <Box
      onClick={(e) => {
        console.log("Wishlist button clicked!"); // Debug log
        handleAddOrRemoveFav(e);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "6px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      }}>
      {isFavorite ? (
        <FavoriteIcon
          sx={{
            color: "#4CAF50",
            fontSize: 20,
          }}
        />
      ) : (
        <FavoriteBorderOutlinedIcon
          sx={{
            color: "#666",
            fontSize: 20,
            "&:hover": { color: "#4CAF50" },
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          color: isFavorite ? "#4CAF50" : "#666",
          fontWeight: "500",
          fontSize: "14px",
          "&:hover": { color: "#4CAF50" },
        }}>
        {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
      </Typography>
    </Box>
  );

  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }} color="#000">
        Color
      </Typography>

      {/* <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <ColorPicker
            colors={colors}
            selected={field.value}
            onSelectColor={(color) => field.onChange(color)}
            limit={4}
          />
        )}
      /> */}
    </Stack>
  );

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }} color="#000">
        Size
      </Typography>

      <RHFSelect
        name="size"
        size="small"
        helperText={
          <Link underline="always" sx={{ color: "#000" }}>
            Size Chart
          </Link>
        }
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: {
            mx: 0,
            mt: 1,
            textAlign: "right",
          },
        }}>
        {sizes.map((size) => (
          <MenuItem key={size} value={size} sx={{ color: "#000" }}>
            {size}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );

  const renderQuantity = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "8px 12px",
        minWidth: "120px",
        justifyContent: "space-between",
      }}>
      <Box
        onClick={() => {
          if (values.quantity > 1) {
            setValue("quantity", values.quantity - 1);
          }
        }}
        sx={{
          cursor: values.quantity > 1 ? "pointer" : "not-allowed",
          opacity: values.quantity > 1 ? 1 : 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          color: "#666",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
        -
      </Box>

      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#333",
          minWidth: "40px",
          textAlign: "center",
        }}>
        {values.quantity.toString().padStart(2, "0")}
      </Typography>

      <Box
        onClick={() => {
          if (values.quantity < available) {
            setValue("quantity", values.quantity + 1);
          }
        }}
        sx={{
          cursor: values.quantity < available ? "pointer" : "not-allowed",
          opacity: values.quantity < available ? 1 : 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          color: "#666",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
        +
      </Box>
    </Box>
  );

  const renderActions = (
    <Stack direction="row" spacing={2} width="100%">
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        variant="contained"
        endIcon={
          <Iconify
            icon="solar:cart-outline"
            width={20}
            sx={{ color: "#fff" }}
          />
        }
        onClick={(e) => {
          e.stopPropagation();
          handleAddCart();
        }}
        sx={{
          backgroundColor: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "uppercase",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#45a049",
          },
          "&:disabled": {
            backgroundColor: "#ccc",
            color: "#666",
          },
        }}>
        Add to Card
      </Button>

      <Button
        fullWidth
        size="large"
        variant="outlined"
        disabled={disabledActions}
        loading={isBuyNowLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleBuyNow();
        }}
        sx={{
          backgroundColor: "#000",
          color: "#4CAF50",
          fontWeight: "bold",
          textTransform: "uppercase",
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#000",
            border: "2px solid #45a049",
            color: "#45a049",
          },
          "&:disabled": {
            backgroundColor: "#333",
            border: "2px solid #666",
            color: "#666",
          },
        }}>
        Buy Now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: "#000" }}>
      {subDescription}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: "#000",
        typography: "body2",
      }}>
      <Rating
        size="small"
        value={ratingCount}
        precision={0.1}
        readOnly
        sx={{ mr: 1 }}
      />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: "overline",
        color:
          (inventoryType === "out of stock" && "error.main") ||
          (inventoryType === "low stock" && "warning.main") ||
          "success.main",
      }}>
      {inventoryType}
    </Box>
  );

  return (
    // <FormProvider methods={methods} onSubmit={onSubmit}>
    <Stack spacing={3} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        {renderLabels}

        {renderInventoryType}

        {/* {renderRating} */}

        {renderPrice}
        {/* {renderContact} */}
        {/* {form} */}

        {/* <Box
          sx={{
            background: "#fff",
            border: "1px solid #c3cdd5",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            borderRadius: ".5rem",
            // borderColor: '#c3cdd5!important',
            width: "100%",
            padding: ".75rem 1rem",
          }}>
          <CheckAvailabiltyForm
            make={product.carDetails?.make}
            year={product.carDetails?.yearOfManufacture}
            carUserEmail={product?.owner?.email}
          />
        </Box> */}

        {renderSubDescription}
      </Stack>

      {/* {renderColorOptions} */}

      {/* {renderSizeOptions} */}

      <Stack direction="row" gap={1} width="100%">
        {renderQuantity}
        {renderActions}
      </Stack>
      <Stack direction="row" width="1005" justifyContent="space-between">
        {renderWishList}
        {renderShare}
      </Stack>
    </Stack>
    // </FormProvider>
  );
}

ShopDetailSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  //   onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
