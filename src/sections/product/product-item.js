import PropTypes from "prop-types";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { m } from "framer-motion";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import { ColorPreview } from "src/components/color-utils";

import { useCheckoutContext } from "../checkout/context";
import { Button, Chip, Divider, IconButton, Typography } from "@mui/material";
import SimpleDialog from "../_examples/mui/dialog-view/simple-dialog";
import { varHover } from "src/components/animate";
import { useAuthContext } from "src/auth/hooks";
import { useEffect, useMemo } from "react";
import { CarsService } from "src/services";

// ----------------------------------------------------------------------

export default function ProductItem({
  product,
  onAddOrRemoveFav = () => {},
  onHome = false,
}) {
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
  } = product;

  const { user = {} } = useAuthContext()?.user || {};

  const { updateUserData = () => {} } = useAuthContext() || {};

  const handleAddOrRemoveFav = async () => {
    try {
      const data = {
        userID: user?._id,
        carID: product?._id,
      };
      const res = await CarsService.addOrRemoveFavouriteCar(data);
      if (res?.status === 200) {
        updateUserData(res?.data);
        onAddOrRemoveFav();
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const linkTo = paths.product.details(id);

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
          fontSize:'16px',
          display: "flex",
          gap: "5px",
          color: color,
          justifyContent: "end",
        }}
      >
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
      <Box sx={{ position: "relative", p: 1 }}>
        <Link
          style={{ textDecoration: "none" }}
          href={paths.dashboard.cars.details(product?._id)}
        >
          <Image
            alt={name}
            src={image[0]}
            ratio="4/3"
            sx={{
              borderRadius: 2,
            }}
          />
        </Link>
        {Object.keys(user).length > 0 && (
          <IconButton
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.08, 0.99)}
            size="small"
            color="error"
            sx={{
              background: "#fff",
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
            onClick={handleAddOrRemoveFav}
          >
            <Iconify
              style={{ color: "#ad0003", width: "30px", height: "30px" }}
              fontSize="inherit"
              icon={
                user?.favourite?.includes(product?._id)
                  ? "mdi:favourite"
                  : "mdi:favourite-border"
              }
            />
          </IconButton>
        )}
      </Box>
    );
  };

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
     {onHome ? <Stack
        direction={onHome ? "column" : "row"}
        alignItems="start"
        justifyContent="space-between"
      >
        <Stack
          direction="column"
          spacing={0.5}
          sx={{ typography: "subtitle1" }}
        >
          <Link
            style={{ textDecoration: "none" }}
            href={paths.dashboard.cars.details(product?._id)}
          >
            <Box
              component="p"
              sx={{
                maxWidth: "230px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                margin: 0,
                ...(onHome ? { fontSize: "14px", maxWidth: "200px" } : {}),
              }}
            >
              {title}
            </Box>
          </Link>
         
        </Stack>
        <Box fontWeight="bold" component="span">
        <Stack
        direction= "row"
        gap="12px"
        alignItems="center"
        justifyContent="space-between"
      >
          £{Number(price)?.toLocaleString()} 
          <Typography variant="caption"> |</Typography>

          <Typography variant="caption"> {carDetails?.mileage} mi</Typography>
          </Stack>
        </Box>
      </Stack> :  <Stack
        direction={onHome ? "column" : "row"}
        alignItems="start"
        justifyContent="space-between"
      >
        <Stack
          direction="column"
          spacing={0.5}
          sx={{ typography: "subtitle1" }}
        >
          <Link
            style={{ textDecoration: "none" }}
            href={paths.dashboard.cars.details(product?._id)}
          >
            <Box
              component="p"
              sx={{
                maxWidth: "230px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                margin: 0,
                ...(onHome ? { fontSize: "14px", maxWidth: {md:"230px",xs:"330px",sm:"330px"}} : {}),
              }}
            >
              {title}
            </Box>
          </Link>
          <Typography variant="caption">{carDetails?.mileage} mi</Typography>
        </Stack>
        <Box fontWeight="bold" component="span">
          £{Number(price)?.toLocaleString()} 
          
        </Box>
      </Stack>}

      <Stack
        direction={onHome ? "column" : "row"}
        sx={{ justifyContent: "space-between", flex: 1 ,
        ...(onHome ? {justifyContent: "center",alignItems:'center'  } : {}),
      }}
        gap={1}
      >
        <Chip
          // p={2}
          sx={{
            textTransform: "capitalize",
            background: "#ad0003",
            color: "#fff",
            width: "30%",
            ...(onHome ? { width: "100%" ,fontSize:'13px'} : {}),
          }}
          label={`For ${category}`}
          //   // component={RouterLink}
          //   // href={linkTo}
          //   color="inherit"
          //   variant="subtitle2"
          //   noWrap
        ></Chip>
        {status}
      </Stack>
      {!onHome && (
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
            minHeight: carDetails?.features ? "unset" : "56px",
          }}
          gap={1}
        >
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
       sx={{ display: "flex",fontSize:'13px' }}
       gap={1}
       fontWeight="bold"
       alignItems="center"
       target="_blank"
       href={
         postalCode
           ? `https://www.google.com/maps/place/${postalCode}`
           : "#"
       }
     > {postalCode ? (
      location + ", " + postalCode
    ) : (
      "Location Not Available"
    )}
        </Link>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="15px"
          alignContent="flex-end"
        >
          <Box
            sx={{
              width: "20px",
              cursor: postalCode ? "pointer !important" : "default",
            }}
          >
            <Tooltip
              title={
                postalCode
                  ? location + ", " + postalCode
                  : "Location Not Available"
              }
            >
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
                }
              >
                <Iconify icon="tabler:location" />{" "}
                {/* {postalCode ? location + ", " + postalCode : "Location Not Available"} */}
              </Link>
            </Tooltip>
          </Box>
          <SimpleDialog />
        </Stack>
      )}
      {/* <Divider />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        
      </Stack> */}
    </Stack>
  );

  return (
    <Card
    
      sx={{
        width:"100%",
      borderRadius:'4px',
      background:'#f7f7f7 ',
      border:'1px solid #c3cdd5',
        "&:hover ": {
          opacity: 1,
          boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"
       },
      }}
    >
      <RenderImg />

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
