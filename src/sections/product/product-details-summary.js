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

// ----------------------------------------------------------------------

export default function ProductDetailsSummary({
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

  // useEffect(() => {
  //   if (product) {
  //     reset(defaultValues);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [product]);

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
          <Typography variant="body1" color="#fff" whiteSpace="nowrap">
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
            {product.sku && (
              <Typography color="#828282" fontSize="14px">
                <span style={{ fontWeight: "500" }}>Sku:</span> {product.sku}
              </Typography>
            )}

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
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "#000",
        }}>
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "#000",
          display: "inline-flex",
          alignItems: "center",
        }}>
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}>
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
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

  // const renderQuantity = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Quantity
  //     </Typography>

  //     <Stack spacing={1}>
  //       <IncrementerButton
  //         name="quantity"
  //         quantity={values.quantity}
  //         disabledDecrease={values.quantity <= 1}
  //         disabledIncrease={values.quantity >= available}
  //         onIncrease={() => setValue('quantity', values.quantity + 1)}
  //         onDecrease={() => setValue('quantity', values.quantity - 1)}
  //       />

  //       <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
  //         Available: {available}
  //       </Typography>
  //     </Stack>
  //   </Stack>
  // );

  // const renderActions = (
  //   <Stack direction="row" spacing={2}>
  //     <Button
  //       fullWidth
  //       disabled={isMaxQuantity || disabledActions}
  //       size="large"
  //       color="warning"
  //       variant="contained"
  //       startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
  //       onClick={handleAddCart}
  //       sx={{ whiteSpace: 'nowrap' }}
  //     >
  //       Add to Cart
  //     </Button>

  //     <Button fullWidth size="large" type="submit" variant="contained" disabled={disabledActions}>
  //       Buy Now
  //     </Button>
  //   </Stack>
  // );

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
        {/* {renderLabels} */}

        {/* {renderInventoryType} */}

        {/* {renderRating} */}

        {renderPrice}
        {renderContact}
        {/* {form} */}

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
          <CheckAvailabiltyForm
            make={product.carDetails?.make}
            year={product.carDetails?.yearOfManufacture}
            carUserEmail={product?.owner?.email}
          />
        </Box>

        {/* {renderSubDescription} */}
      </Stack>

      {/* {renderColorOptions} */}

      {/* {renderSizeOptions} */}

      {/* {renderQuantity} */}

      {/* {renderActions} */}

      {/* {renderShare} */}
    </Stack>
    // </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
