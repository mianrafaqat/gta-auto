"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import ProductItem from "src/sections/product/product-item";
import { ProductItemSkeleton } from "src/sections/product/product-skeleton";
import { CarsService } from "src/services";
import Iconify from "../iconify";
import { Stack } from "@mui/system";

export default function FavouritesCarPage() {
  const { user = {} } = useAuthContext()?.user || {};
  const [userCarsFav, setUserFav] = useState([]);

  const [loading, setLoading] = useState(false);

  // Debug: Log user data
  console.log("Favourites - Auth context user:", useAuthContext()?.user);
  console.log("Favourites - Extracted user:", user);

  // Get the actual user data from the nested structure
  const actualUser = user?.user || user;
  console.log("Favourites - Actual user:", actualUser);
  console.log("Favourites - User ID:", actualUser?._id);

  const fetchUserFavCars = async () => {
    try {
      setLoading(true);
      const data = {
        userId: actualUser?._id,
      };
      console.log("Favourites - Sending data:", data);
      const res = await CarsService.getUserFavouriteCar(data);
      console.log("res: ", res);
      if (res?.status === 200) {
        setUserFav(res?.data?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavCars();
  }, []);

  const hasNoFavCars = !loading && (!userCarsFav || userCarsFav.length === 0);

  return (
    <>
      <Typography sx={{ textAlign: "center", color: "#fff" }} variant="h3">
        My Favorite Cars Gallery
      </Typography>

      <Box
        mt={2}
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        mb={5}>
        {loading ? (
          <>
            {[...Array(8)].map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {userCarsFav?.map((car) => (
              <ProductItem
                key={car?._id}
                product={car}
                onAddOrRemoveFav={fetchUserFavCars}
              />
            ))}
          </>
        )}
      </Box>
      {hasNoFavCars && (
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "200px",
            height: "200px",
            background: "#f7f7f7",
            mx: "auto",
            borderRadius: "50%",
            mb: "40px",
          }}>
          <Iconify
            width="100px"
            style={{ color: "#4caf50", display: "block" }}
            icon="mdi:car-off"
          />
          <Typography
            variant="subtitle1"
            sx={{ color: "#888", mt: 2, textAlign: "center" }}>
            No car added yet
          </Typography>
        </Stack>
      )}
    </>
  );
}
