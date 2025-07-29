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
  const { user } = useAuthContext()?.user || {};
  const [userCarsFav, setUserFav] = useState([]);

  const [loading, setLoading] = useState(false);

  console.log("userfac: ", userCarsFav);

  const fetchUserFavCars = async () => {
    try {
      setLoading(true);
      const data = {
        userId: user?._id,
      };
      const res = await CarsService.getUserFavouriteCar(data);
      console.log("res: ", res);
      if (res?.status === 200) {
        setUserFav(res?.data);
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

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h3">
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
        mb={5}
      >
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
      {!userCarsFav?.length && (
        <Stack direction="row" alignItems='center' justifyContent='center' sx={{width: "200px", height: "200px", background: '#f7f7f7', margin: "0 auto", borderRadius: "50%"}}>
          <Iconify
          width="100px"
          style={{ color: "#4caf50", display: "block" }}
          icon="mdi:car-off"
        />
        </Stack>
      )}
    </>
  );
}
