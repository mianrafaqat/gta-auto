"use client";

import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";
import { useDebounce } from "src/hooks/use-debounce";

import { useGetProducts, useSearchProducts } from "src/api/product";
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from "src/_mock";

import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";

import ProductList from "../product-list";
import ProductSort from "../product-sort";
import CartIcon from "../common/cart-icon";
import ProductSearch from "../product-search";
import ProductFilters from "../product-filters";
import { useCheckoutContext } from "../../checkout/context";
import ProductFiltersResult from "../product-filters-result";
import {
  Box,
  Drawer,
  Grid,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useResponsive } from "src/hooks/use-responsive";
import IconButton from "@mui/material/IconButton";
import SvgColor from "src/components/svg-color";
import Loading from "src/app/loading";
import { SplashScreen } from "src/components/loading-screen";
import { Icon } from "@iconify/react";

const FUEL_TYPES_LIST = ["Diesel", "Petrol", "Hybrid Electric", "Electric"];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const defaultFilters = {
    priceRange: [0, 20000000],
    category: "all",
    searchByTitle: "",
    year: [1940, new Date().getFullYear()],
    fuelType: "",
    mileage: [0, 200000000],
    makeType: "",
  };

  useEffect(() => {
    <SplashScreen />;
  }, []);

  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const openFilters = useBoolean(true);

  const [sortBy, setSortBy] = useState("featured");

  const [filters, setFilters] = useState(defaultFilters);
  const [reset, setReset] = useState(false);

  // Use the same API endpoint as product list view
  const { products: allCars, productsLoading: loading } = useGetProducts();

  // Debug log to see the mapped data
  useEffect(() => {
    if (allCars.length > 0) {
      console.log("Products from API in shop view:", allCars);
    }
  }, [allCars]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setReset((prev) => !prev);
  }, []);

  const dataFiltered = applyFilter({
    inputData: allCars,
    filters,
    sortBy,
  });

  const canReset = () => {
    setFilters({ ...defaultFilters });
  };

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      width="100%"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}>
      <ProductSearch
        // query={debouncedQuery}
        // results={searchResults}
        onSearch={handleSearch}
        // loading={searchLoading}
        hrefItem={(id) => paths.product.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <IconButton onClick={() => setToggle(!toggle)}>
          <Typography sx={{ mr: "8px", color: "#4caf50" }}>Filters</Typography>

          <Icon icon="mage:filter-fill" color="#4caf50" />
        </IconButton>
        <ProductSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const lgUp = useResponsive("up", "lg");

  const [toggle, setToggle] = useState(false);
  const onClose = () => setToggle(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar for ProductFilters */}
      {/* {lgUp ? (
        <Box
          sx={{
            width: "20%",
            border: "1px solid #ccd1d1",
            height: "fit-content",
            borderRadius: "6px",
            mt: "34px",
          }}>
          <ProductFilters
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            colorOptions={PRODUCT_COLOR_OPTIONS}
            ratingOptions={PRODUCT_RATING_OPTIONS}
            genderOptions={PRODUCT_GENDER_OPTIONS}
            fuelOptions={[...FUEL_TYPES_LIST]}
            reset={reset}
          />
       
        </Box>
      ) : (
        <Drawer
          open={toggle}
          onClose={onClose}
          PaperProps={{
            sx: {
              width: "75%",
            },
          }}>
          <Box>
            <ProductFilters
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              filters={filters}
              onFilters={handleFilters}
              canReset={canReset}
              onResetFilters={handleResetFilters}
              colorOptions={PRODUCT_COLOR_OPTIONS}
              ratingOptions={PRODUCT_RATING_OPTIONS}
              genderOptions={PRODUCT_GENDER_OPTIONS}
              fuelOptions={[...FUEL_TYPES_LIST]}
              reset={reset}
            />
          </Box>
        </Drawer>
      )} */}

      <Drawer
        open={toggle}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { md: "30%", xs: "75%" },
          },
        }}>
        <Box>
          {/* <ProductFilters
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            colorOptions={PRODUCT_COLOR_OPTIONS}
            ratingOptions={PRODUCT_RATING_OPTIONS}
            genderOptions={PRODUCT_GENDER_OPTIONS}
            fuelOptions={[...FUEL_TYPES_LIST]}
            categoryOptions={PRODUCT_CATEGORY_GROUP_OPTIONS}
            reset={reset}
          /> */}
        </Box>
      </Drawer>

      {/* {!isSmallScreen && (
      <Box sx={{ width: '20%' }}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={[...CATOGRIES_LIST]}
          fuelOptions={[...FUEL_TYPES_LIST]}
          onHandleSearch={setAllCars}
          reset={reset}
        />
      </Box>
    )} */}

      <Box
        sx={{
          width: isSmallScreen ? "100%" : "100%",
          ml: isSmallScreen ? 0 : "auto",
        }}>
        <Container
          maxWidth={settings.themeStretch ? false : "xl"}
          sx={{
            mb: 15,
          }}>
          <Grid container spacing={2}>
            {/* Cart icon (optional) */}
            {/* <Grid item xs={12}>
            <CartIcon totalItems={checkout.totalItems} />
          </Grid> */}

            {/* Title */}
            <Grid item xs={12}>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Typography
                  variant="h4"
                  sx={{
                    my: { xs: 3, md: 5 },
                    color: "#fff",
                  }}>
                  Shop
                </Typography>
                {/* {!lgUp && !loading && (
                  <IconButton onClick={() => setToggle(!toggle)}>
                    <Icon icon="mage:filter-fill" />
                  </IconButton>
                )} */}
              </Stack>
            </Grid>
            <Stack
              spacing={2.5}
              sx={{
                mb: { xs: 3, md: 5 },
                width: "100%",
              }}>
              {renderFilters}

              {/* {canReset && renderResults} */}
            </Stack>

            {/* Render NotFound component if no results */}
            <Grid item xs={12}>
              {!dataFiltered?.length && !loading && (
                <EmptyContent
                  filled
                  title="No Data"
                  sx={{ py: 10, color: "#fff" }}
                />
              )}
            </Grid>

            {/* Render ProductList */}
            <Grid item xs={12}>
              <ProductList products={dataFiltered} loading={loading} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const {
    gender,
    category,
    colors,
    priceRange,
    rating,
    searchByTitle,
    year,
    fuelType,
    mileage,
    makeType,
  } = filters;

  const min = priceRange[0];
  const max = priceRange[1];

  // FILTERS

  if (category !== "all") {
    inputData = inputData.filter(
      (product) => product?.category?.toUpperCase() === category?.toUpperCase()
    );
  }

  inputData = inputData.filter(
    (product) => Number(product.price) >= min && Number(product.price) <= max
  );

  if (searchByTitle) {
    inputData = inputData.filter(
      (product) =>
        product.title?.toLowerCase().includes(searchByTitle?.toLowerCase()) ||
        product.name?.toLowerCase().includes(searchByTitle?.toLowerCase())
    );
  }

  // Filter by status (published products only)
  inputData = inputData.filter((p) => p.status === "published");

  console.log("Filtered products: ", inputData);

  return inputData;
}
