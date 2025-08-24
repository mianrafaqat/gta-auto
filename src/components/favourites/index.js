"use client";

import { Box, Typography, Tabs, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import ProductItem from "src/sections/product/product-item";
import { ProductItemSkeleton } from "src/sections/product/product-skeleton";
import { CarsService } from "src/services";
import Iconify from "../iconify";
import { Stack } from "@mui/system";
import GarageList from "src/sections/garage/garage-list";
import GarageItem from "src/sections/garage/garage-item";
import ShopProductCard from "src/sections/product/shop-product-card";
import UserService from "src/services/users/users.service";

export default function FavouritesCarPage() {
  const { user = {} } = useAuthContext()?.user || {};
  const [userCarsFav, setUserFav] = useState([]);
  const [userProductsFav, setUserProductsFav] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
      if (!actualUser?._id) {
        console.error("No user ID available");
        return;
      }

      const data = {
        userId: actualUser._id,
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

  const fetchUserFavProducts = async () => {
    try {
      setProductsLoading(true);
      const data = {
        userId: actualUser?._id, // Changed to match backend expectation
      };
      console.log("Favourites - Sending product data:", data);
      const res = await UserService.getUserFavoriteProducts(data);
      console.log("Product favorites res: ", res);
      if (res?.status === 200 && res?.data?.success) {
        setUserProductsFav(res?.data?.data || []);
      }
    } catch (err) {
      console.log("Product favorites err: ", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (actualUser?._id) {
      fetchUserFavCars();
      fetchUserFavProducts();
    }
  }, [actualUser]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const hasNoFavCars = !loading && (!userCarsFav || userCarsFav.length === 0);
  const hasNoFavProducts =
    !productsLoading && (!userProductsFav || userProductsFav.length === 0);

  const renderGarageTab = () => (
    <>
      <Typography
        sx={{ textAlign: "center", color: "#fff", mb: 3 }}
        variant="h3">
        My Favorite Cars Gallery
      </Typography>

      <Box
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
              <GarageItem
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

  const renderProductsTab = () => (
    <>
      <Typography
        sx={{ textAlign: "center", color: "#fff", mb: 3 }}
        variant="h3">
        My Favorite Products
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        mb={5}>
        {productsLoading ? (
          <>
            {[...Array(8)].map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {userProductsFav?.map((product) => (
              <ShopProductCard
                key={product?._id}
                product={product}
                onAddOrRemoveFav={fetchUserFavProducts}
              />
            ))}
          </>
        )}
      </Box>
      {hasNoFavProducts && (
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
            icon="mdi:package-variant-closed"
          />
          <Typography
            variant="subtitle1"
            sx={{ color: "#888", mt: 2, textAlign: "center" }}>
            No products added yet
          </Typography>
        </Stack>
      )}
    </>
  );

  return (
    <>
      <Typography
        sx={{ textAlign: "center", color: "#fff", mb: 4 }}
        variant="h2">
        My Favorites
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              color: "#fff",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              minWidth: "120px",
            },
            "& .Mui-selected": {
              color: "#4caf50",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#4caf50",
            },
          }}>
          <Tab label="Garage" />
          <Tab label="Products" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && renderGarageTab()}
        {activeTab === 1 && renderProductsTab()}
      </Box>
    </>
  );
}
