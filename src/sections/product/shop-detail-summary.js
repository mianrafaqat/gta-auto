import PropTypes from "prop-types";
import { useEffect, useCallback, useMemo } from "react";
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

import IncrementerButton from "./common/incrementer-button";
import CheckAvailabiltyForm from "./check-availabilty-form";
import { Chip } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

// ----------------------------------------------------------------------

export default function ShopDetailSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const router = useRouter();

  const {
    id,
    _id, // Add _id for new API structure
    name,
    title, // Keep title for backward compatibility
    sizes = [],
    price,
    regularPrice,
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
    type, // Add type for new API structure
    slug, // Add slug for new API structure
  } = product;

  // Get the product ID, handling both old and new API structures
  const productId = _id || id;

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
            PKR{price ? Number(price)?.toLocaleString() : 0}
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

      <Iconify
        icon="solar:copy-bold"
        width={18}
        sx={{
          color: "#666",
          cursor: "pointer",
          "&:hover": { color: "#4CAF50" },
        }}
      />

      <Box
        sx={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#45a049" },
        }}>
        <Iconify icon="ri:facebook-fill" width={16} sx={{ color: "#fff" }} />
      </Box>

      <Iconify
        icon="ri:twitter-fill"
        width={20}
        sx={{
          color: "#666",
          cursor: "pointer",
          "&:hover": { color: "#4CAF50" },
        }}
      />

      <Iconify
        icon="ri:pinterest-fill"
        width={20}
        sx={{
          color: "#666",
          cursor: "pointer",
          "&:hover": { color: "#4CAF50" },
        }}
      />
    </Stack>
  );

  const renderWishList = (
    <Box
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
      <Iconify
        icon="solar:heart-outline"
        width={20}
        sx={{
          color: "#666",
          "&:hover": { color: "#4CAF50" },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: "#666",
          fontWeight: "500",
          fontSize: "14px",
          "&:hover": { color: "#4CAF50" },
        }}>
        Add to Wishlist
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
        onClick={() => onAddCart(product)}
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
        onClick={() => {
          onAddCart(product);
          onGotoStep(1);
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
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
