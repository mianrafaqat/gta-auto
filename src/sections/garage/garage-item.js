import PropTypes from "prop-types";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import { ColorPreview } from "src/components/color-utils";

import { useCheckoutContext } from "../checkout/context";
import { Button, Chip, Divider, IconButton, Typography } from "@mui/material";
import SimpleDialog from "../_examples/mui/dialog-view/simple-dialog";
import { useAuthContext } from "src/auth/hooks";
import { useEffect, useMemo } from "react";
import { useAddOrRemoveFavoriteCar } from "src/hooks/use-cars";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

export default function GarageItem({
  product,
  onAddOrRemoveFav = () => {},
  onHome = false,
}) {
  const router = useRouter();
  const { onAddToCart } = useCheckoutContext();

  const {
    price,
    category,
    carDetails,
    title,
    image,
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
    slug,
  } = product;

  const { user = {} } = useAuthContext()?.user || {};

  const { updateUserData = () => {} } = useAuthContext() || {};

  // Debug: Log the entire auth context

  // React Query mutation for favorite functionality
  const addOrRemoveFavoriteMutation = useAddOrRemoveFavoriteCar();

  const handleAddOrRemoveFav = async () => {
    try {
      // Get the actual user data from the nested structure
      const actualUser = user?.user || user;
   
      const data = {
        userID: actualUser?._id, // Fixed: Access user ID from the correct user object
        carID: product?._id, // Changed from carID to match backend expectation
      };


      const result = await addOrRemoveFavoriteMutation.mutateAsync(data);


      if (result?.status === 200) {
        // Update user data with the new favorite list
        updateUserData(result?.data);
        onAddOrRemoveFav();
      }
    } catch (err) {
      console.error("Error adding/removing favorite: ", err);
    }
  };

  const linkTo = paths.product.details(slug || id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      coverUrl,
      available,
      price,
      colors: [colors[0]],
      size: sizes[0],
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
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
    // Get the actual user data from the nested structure
    const actualUser = user?.user || user;

    return (
      <Box sx={{ position: "relative" }}>
        <Link
          style={{ textDecoration: "none" }}
          href={paths.dashboard.cars.details(product?._id)}>
          <Image
            alt={name}
            src={image[0]}
            ratio="4/3"
            width="100%"
            height="288px"
          />
        </Link>
        {actualUser &&
          Object.keys(actualUser).length > 0 &&
          actualUser?._id && (
            <IconButton
              size="small"
              color="error"
              disabled={addOrRemoveFavoriteMutation.isPending}
              sx={{
                background: "#fff",
                position: "absolute",
                right: "10px",
                top: "10px",
              }}
              onClick={handleAddOrRemoveFav}>
              <Iconify
                style={{ color: "#4caf50", width: "30px", height: "30px" }}
                fontSize="inherit"
                icon={
                  actualUser?.favourite?.includes(product?._id)
                    ? "mdi:favourite"
                    : "mdi:favourite-border"
                }
              />
            </IconButton>
          )}
      </Box>
    );
  };

  // Helper function to get the appropriate price for display
  const getDisplayPrice = () => {
    if (category?.toLowerCase() === "rent") {
      return carDetails?.dailyRate || "N/A";
    }
    return price || "N/A";
  };

  // Helper function to get the price label
  const getPriceLabel = () => {
    if (category?.toLowerCase() === "rent") {
      return "PKR";
    }
    return "PKR";
  };

  const renderContent = (
    <Stack gap={2.5} sx={{ px: "18px", py: "16px", bgcolor: "#fff" }}>
      {onHome ? (
        <Stack
          direction={onHome ? "column" : "row"}
          alignItems="start"
          justifyContent="space-between">
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ typography: "subtitle1" }}>
            <Link
              style={{ textDecoration: "none" }}
              href={paths.dashboard.cars.details(product?._id)}>
              <Box
                component="p"
                sx={{
                  maxWidth: "230px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  margin: 0,
                  color: "white",
                  ...(onHome ? { fontSize: "14px", maxWidth: "200px" } : {}),
                }}>
                {title}
              </Box>
            </Link>
          </Stack>
          <Box fontWeight="bold" component="span">
            <Stack
              direction="row"
              gap="12px"
              alignItems="center"
              justifyContent="space-between"
              color="white">
              {getPriceLabel()}
              {Number(getDisplayPrice())?.toLocaleString()} / day
              <Typography variant="caption" color="white">
                {" "}
                |
              </Typography>
              <Typography variant="caption" color="white">
                {" "}
                {carDetails?.mileage} mi
              </Typography>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Stack
          direction={onHome ? "column" : "row"}
          alignItems="start"
          justifyContent="space-between"
          bgcolor="#fff">
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ typography: "subtitle1" }}>
            <Link
              style={{ textDecoration: "none" }}
              href={paths.dashboard.cars.details(product?._id)}>
              <Box
                component="h6"
                sx={{
                  maxWidth: "250px",
                  margin: 0,
                  display: "block",
                  fontWeight: 500,
                  color: "black",
                  mb: "0px",
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  ...(onHome
                    ? {
                        fontSize: "14px",
                        maxWidth: { md: "430px", xs: "330px", sm: "330px" },
                      }
                    : {}),
                }}
                title={title}>
                {title}
              </Box>
            </Link>
            {/* <Typography variant="caption" color="white">
              {carDetails?.mileage} mi
            </Typography> */}

            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                mb: "12px",
                fontSize: "0.875rem",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                textWrap: "nowrap",
              }}>
              {title}
            </Typography>

            <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Iconify
                  icon="eva:car-outline"
                  sx={{ fontSize: 16, color: "grey.500" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  }}>
                  {carDetails?.mileage || "N/A"} mi
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Iconify
                  icon="eva:droplet-outline"
                  sx={{ fontSize: 16, color: "grey.500" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                  {carDetails?.fuelType || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Iconify
                  icon="eva:settings-outline"
                  sx={{ fontSize: 16, color: "grey.500" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                  {carDetails?.transmission || "N/A"}
                </Typography>
              </Box>
            </Stack>

            {/* Rental-specific information */}
            {category?.toLowerCase() === "rent" && (
              <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
                {carDetails?.minimumRentalPeriod && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Iconify
                      icon="eva:clock-outline"
                      sx={{ fontSize: 16, color: "grey.500" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                      Min: {carDetails.minimumRentalPeriod}
                    </Typography>
                  </Box>
                )}
                {carDetails?.securityDeposit && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Iconify
                      icon="eva:shield-outline"
                      sx={{ fontSize: 16, color: "grey.500" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                      Deposit: PKR{" "}
                      {Number(carDetails.securityDeposit)?.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                {carDetails?.availableFromDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Iconify
                      icon="eva:calendar-outline"
                      sx={{ fontSize: 16, color: "grey.500" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.600", fontSize: "0.8rem" }}>
                      From:{" "}
                      {new Date(
                        carDetails.availableFromDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "auto",
        }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "black",
            fontSize: "1rem !important",
          }}>
          {getPriceLabel()}{" "}
          {Number(getDisplayPrice())?.toLocaleString() || "N/A"}
          {category === "rent" ? "/d" : ""}
        </Typography>
        <Button
          variant="text"
          endIcon={<Iconify icon="eva:arrow-forward-fill" />}
          sx={{
            color: "#405FF2",
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(33, 150, 243, 0.1)",
            },
          }}
          onClick={() =>
            router.push(paths.dashboard.cars.details(product?._id))
          }>
          View Details
        </Button>
      </Box>

      {/* <Stack
        direction={onHome ? "column" : "row"}
        sx={{
          justifyContent: "space-between",
          flex: 1,
          ...(onHome ? { justifyContent: "center", alignItems: "center" } : {}),
        }}
        gap={1}>
        <Chip
          sx={{
            textTransform: "capitalize",
            background: "#4caf50",
            color: "#fff",
            width: "30%",
            ...(onHome ? { width: "100%", fontSize: "13px" } : {}),
          }}
          label={`For ${category}`}></Chip>
        {status}
      </Stack>
      {!onHome && (
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
            minHeight: carDetails?.features ? "unset" : "56px",
          }}
          gap={1}>
          {carDetails?.features?.slice(0, 3).map((f, index) => (
            <Label key={index} color="primary" variant="soft">
              {f}
            </Label>
          ))}
          {carDetails?.features?.length > 3 && (
            <Label key="more" color="primary" variant="soft">
              +more
            </Label>
          )}
        </Stack>
      )}

      {onHome ? (
        <Link
          component={postalCode ? "a" : "button"}
          sx={{ display: "flex", fontSize: "13px", color: "white" }}
          gap={1}
          fontWeight="bold"
          alignItems="center"
          target="_blank"
          href={
            postalCode ? `https://www.google.com/maps/place/${postalCode}` : "#"
          }>
          {" "}
          {postalCode ? location + ", " + postalCode : "Location Not Available"}
        </Link>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="15px"
          alignContent="flex-end">
          <Box
            sx={{
              width: "20px",
              cursor: postalCode ? "pointer !important" : "default",
            }}>
            <Tooltip
              title={
                postalCode
                  ? location + ", " + postalCode
                  : "Location Not Available"
              }>
              <Link
                component={postalCode ? "a" : "button"}
                sx={{ display: "flex" }}
                gap={1}
                fontWeight="bold"
                alignItems="center"
                target="_blank"
                href={
                  postalCode
                    ? `https://www.google.com/maps/place/${postalCode}`
                    : "#"
                }>
                <Iconify icon="tabler:location" />
              </Link>
            </Tooltip>
          </Box>
          <SimpleDialog />
        </Stack>
      )} */}
    </Stack>
  );

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "24px",
        background: "transparent",
        overflow: "hidden",
      }}>
      <Box
        sx={{
          minHeight: "380px",
          backgroundImage: `url(${image?.[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}>
        {/* <RenderImg /> */}
      </Box>
      {renderContent}
    </Card>
  );
}

GarageItem.propTypes = {
  product: PropTypes.object,
};
