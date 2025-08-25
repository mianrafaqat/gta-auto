import PropTypes from "prop-types";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useRouter } from "src/routes/hooks";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import { ColorPreview } from "src/components/color-utils";

import { useCheckoutContext } from "../checkout/context";
import SimpleDialog from "../_examples/mui/dialog-view/simple-dialog";
import { useAuthContext } from "src/auth/hooks";
import { useEffect, useMemo, useState } from "react";
import { useAddOrRemoveFavoriteCar } from "src/hooks/use-cars";
import ProductService from "src/services/products/products.service";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

// ----------------------------------------------------------------------

// Add CSS keyframes for spin animation
const spinKeyframes = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function ProductItem({
  product,
  onAddOrRemoveFav = () => {},
  onHome = false,
}) {
  const router = useRouter();
  const { onAddToCart, onGotoStep, update, onClearCart } = useCheckoutContext();
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  const {
    price,
    category,
    carDetails,
    title,
    image,
    images, // Add images for new API structure
    id,
    name,
    coverUrl,
    colors,
    location,
    available,
    sizes,
    postalCode,
    owner,
    tel,
    _id, // Add _id for new API structure
    regularPrice,
    salePrice,
    categories,
  } = product;

  // Get the product ID, handling both old and new API structures
  const productId = _id || id;

  // Get the image array, handling both old and new API structures
  const imageArray = images || image || [];
  const firstImage = imageArray[0] || coverUrl || "/assets/placeholder.svg";

  // Get the product name, handling both old and new API structures
  const productName = name || title || "Product";

  // Get the product price, handling both old and new API structures
  const productPrice = price || 0;
  const productRegularPrice = regularPrice || price || 0;
  const productSalePrice = salePrice || 0;

  // Get the product category, handling both old and new API structures
  const productCategory =
    category ||
    (categories && categories.length > 0 ? categories[0].name : "sale");

  // Get the product location, handling both old and new API structures
  const productLocation = location || "";

  // Get the product postal code, handling both old and new API structures
  const productPostalCode = postalCode || "";

  // Get the product availability, handling both old and new API structures
  const productAvailable = available !== undefined ? available : true;

  const { user = {} } = useAuthContext()?.user || {};

  const { updateUserData = () => {} } = useAuthContext() || {};

  // Debug: Log the entire auth context
  console.log("Auth context user:", useAuthContext()?.user);
  console.log("Extracted user object:", user);

  // React Query mutation for favorite functionality
  const addOrRemoveFavoriteMutation = useAddOrRemoveFavoriteCar();

  const handleAddOrRemoveFav = async () => {
    try {
      // Get the actual user data from the nested structure
      const actualUser = user?.user || user;
      console.log("Current user object:", actualUser); // Debug: Log the entire user object
      console.log("User ID being sent:", actualUser?._id); // Debug: Log the specific user ID

      const data = {
        userID: actualUser?._id, // Fixed: Access user ID from the correct user object
        carID: product?._id, // Changed from carID to match backend expectation
      };

      console.log("Sending favorite data:", data); // Debug log

      const result = await addOrRemoveFavoriteMutation.mutateAsync(data);

      console.log("Favorite result:", result); // Debug log

      if (result?.status === 200) {
        // Update user data with the new favorite list
        updateUserData(result?.data);
        onAddOrRemoveFav();
      }
    } catch (err) {
      console.error("Error adding/removing favorite: ", err);
    }
  };

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id: productId,
      name: productName,
      coverUrl: firstImage,
      available: productAvailable,
      price: productPrice,
      colors: colors && colors.length > 0 ? [colors[0]] : [],
      size: sizes && sizes.length > 0 ? sizes[0] : "Default",
      quantity: 1,
      // Add car-specific properties if available
      carDetails: carDetails || {},
      category: productCategory,
      location: productLocation,
      postalCode: productPostalCode,
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

  const renderLabels = () => null;

  const DealStatus = ({ title, icon, color }) => {
    return (
      <Typography
        fontWeight={500}
        sx={{
          fontSize: "16px",
          display: "flex",
          gap: "5px",
          color: color,
          justifyContent: "end",
        }}>
        <Iconify icon={icon} />
        {title}
      </Typography>
    );
  };

  const status = useMemo(() => {
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

  const RenderImg = () => {
    return (
      <Stack direction="row" sx={{ position: "relative" }}>
        <Image
          alt={name}
          src={firstImage}
          ratio="4/3"
          sx={{
            borderRadius: "12px 12px 0 0",
            height: "278px",
          }}
        />
        <Box
          sx={{
            bgcolor: "#4CAF50",
            height: "73px",
            borderBottomLeftRadius: "12px",
            minWidth: "70px",
            position: "absolute",
            right: "0",
          }}>
          <Typography
            fontSize="14px"
            color="#fff"
            textAlign="center"
            sx={{ pt: "20px" }}>
            56% OFF
          </Typography>
        </Box>
      </Stack>
    );
  };

  const renderContent = (
    <Stack gap={{ xs: 1, md: 2 }} sx={{ p: { xs: 1, md: 2 }, bgcolor: "#fff" }}>
      {/* Product Title */}
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "14px", md: "16px" },
          fontWeight: "400",
          color: "#333333",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
        {carDetails?.yearOfManufacture
          ? `${carDetails.yearOfManufacture} - `
          : ""}
        {productName}
      </Typography>

      {/* Price Section */}
      <Stack
        direction="row"
        gap={1}
        justifyContent="space-between"
        alignItems="center"
        pb="12px"
        borderBottom="1px solid #E0E0E0">
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            color: "#333333",
            fontSize: "16px",
          }}>
          PKR {Number(productSalePrice)?.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#999999",
            textDecoration: "line-through",
            fontSize: "14px",
          }}>
          PKR {Number(productRegularPrice)?.toLocaleString()}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <Stack
        direction="row"
        flexWrap={{ xs: "wrap", md: "nowrap" }}
        gap={1}
        sx={{ mt: 1, height: "58px", borderRadius: "3px" }}>
        <LoadingButton
          fullWidth
          variant="contained"
          size="medium"
          loading={isBuyNowLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleBuyNow();
          }}
          sx={{
            backgroundColor: "#4caf50",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            minWidth: "140px",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}>
          Buy Now
        </LoadingButton>
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          onClick={(e) => {
            e.stopPropagation();
            handleAddCart();
          }}
          sx={{
            borderColor: "#4caf50",
            color: "#4caf50",
            backgroundColor: "#ffffff",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#45a049",
              backgroundColor: "rgba(76, 175, 80, 0.04)",
            },
          }}>
          <ShoppingCartOutlinedIcon />
        </Button>
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          onClick={(e) => {
            e.stopPropagation();
            handleAddOrRemoveFav();
          }}
          sx={{
            borderColor: "#4caf50",
            color: "#4caf50",
            backgroundColor: "#ffffff",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#45a049",
              backgroundColor: "rgba(76, 175, 80, 0.04)",
            },
          }}>
          <FavoriteBorderOutlinedIcon />
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "12px",
        background: "#F5F5F5",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
      onClick={() => {
        // Navigate to product details
        router.push(paths.product.details(productId));
      }}>
      <RenderImg />
      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
