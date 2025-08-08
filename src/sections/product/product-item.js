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
  const { onAddToCart, onBuyNow, onClearCart } = useCheckoutContext();
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
  } = product;

  // Get the image array, handling both old and new API structures
  const imageArray = images || image || [];
  const firstImage = imageArray[0] || coverUrl || "/assets/placeholder.svg";

  // Debug log to help identify the issue
  console.log("Product data:", {
    productId: product._id || id,
    imageArray,
    firstImage,
    hasImages: !!images,
    hasImage: !!image,
    hasCoverUrl: !!coverUrl,
  });

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
      id: product._id || id,
      name: title || name,
      coverUrl: firstImage,
      available: available || true,
      price: price || 0,
      colors: colors && colors.length > 0 ? [colors[0]] : [],
      size: sizes && sizes.length > 0 ? sizes[0] : "Default",
      quantity: 1,
      // Add car-specific properties if available
      carDetails: carDetails || {},
      category: category || "sale",
      location: location || "",
      postalCode: postalCode || "",
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyNowLoading(true);
    const newProduct = {
      id: product._id || id,
      name: title || name,
      coverUrl: firstImage,
      available: available || true,
      price: price || 0,
      colors: colors && colors.length > 0 ? [colors[0]] : [],
      size: sizes && sizes.length > 0 ? sizes[0] : "Default",
      quantity: 1,
      // Add car-specific properties if available
      carDetails: carDetails || {},
      category: category || "sale",
      location: location || "",
      postalCode: postalCode || "",
    };
    try {
      // Clear cart first, then use Buy Now function
      onClearCart();
      onBuyNow(newProduct);
      // Small delay to ensure cart state is updated
      setTimeout(() => {
        router.push(paths.product.checkout);
      }, 100);
    } catch (error) {
      console.error(error);
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
      <Box sx={{ position: "relative" }}>
        <Image
          alt={name}
          src={firstImage}
          ratio="4/3"
          sx={{
            borderRadius: "12px 12px 0 0",
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
    );
  };

  const renderContent = (
    <Stack spacing={2} sx={{ p: 2 }}>
      {/* Product Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#333333",
          fontSize: "16px",
          lineHeight: 1.2,
        }}>
        {carDetails?.yearOfManufacture
          ? `${carDetails.yearOfManufacture} - `
          : ""}
        {title || name}
      </Typography>

      {/* Price Section */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="body2"
          sx={{
            color: "#999999",
            textDecoration: "line-through",
            fontSize: "14px",
          }}>
          PKR {Number(price)?.toLocaleString()}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333333",
            fontSize: "16px",
          }}>
          PKR {Number(price)?.toLocaleString()}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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
          Add to Cart
        </Button>

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
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}>
          Buy Now
        </LoadingButton>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "12px",
        background: "#ffffff",
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
        router.push(paths.product.details(product._id || id));
      }}>
      <RenderImg />
      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
