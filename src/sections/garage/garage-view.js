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
  PRODUCT_CATEGORY_OPTIONS,
} from "src/_mock";

import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";

// import ProductSearch from "../product-search";
// import { useCheckoutContext } from "../../checkout/context";
// import ProductFiltersResult from "../product-filters-result";
import {
  Box,
  Drawer,
  Grid,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CarsService } from "src/services";
import { useResponsive } from "src/hooks/use-responsive";
import IconButton from "@mui/material/IconButton";
import SvgColor from "src/components/svg-color";
import Loading from "src/app/loading";
import { SplashScreen } from "src/components/loading-screen";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import GarageSort from "./garage-sort";
import GarageList from "./garage-list";
import GarageFilters from "./garage-filter";

const FUEL_TYPES_LIST = ["Diesel", "Petrol", "Hybrid Electric", "Electric"];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function GarageView() {
  const defaultFilters = {
    priceRange: [100000, 25000000],
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

  // const checkout = useCheckoutContext();

  const openFilters = useBoolean(true);

  const [sortBy, setSortBy] = useState("featured");

  const [filters, setFilters] = useState(defaultFilters);
  const [reset, setReset] = useState(false);

  // Replace useState and manual fetching with React Query
  const { data: allCars = [], isLoading: loading } = useQuery({
    queryKey: ["cars", "all"],
    queryFn: async () => {
      const res = await CarsService.getAll();
      if (res?.data) {
        return res?.data?.filter((c) => c?.status !== "Paused") || [];
      }
      return [];
    },
    staleTime: Infinity, // Data will never become stale automatically
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

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
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}>
      {/* <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id) => paths.product.details(id)}
      /> */}

      <Stack direction="row" spacing={1} flexShrink={0}>
        <GarageSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <GarageFilters
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const fetchAllCars = async () => {
    try {
      setLoading(true);
      const res = await CarsService.getAll();
      if (res?.data) {
        const filteredCar =
          res?.data?.filter((c) => c?.status !== "Paused") || [];
        setAllCars(filteredCar);
      }
    } catch (err) {
      console.log("error: ", err);
    } finally {
      // setLoading(false);
      console.log("allCars: ", allCars);
    }
  };

  useEffect(() => {
    fetchAllCars();
  }, []);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const lgUp = useResponsive("up", "lg");

  const [toggle, setToggle] = useState(false);
  const onClose = () => setToggle(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar for ProductFilters */}
      {lgUp ? (
        <Box
          sx={{
            width: "20%",
            border: "1px solid #ccd1d1",
            height: "fit-content",
            borderRadius: "6px",
            mt: "34px",
          }}>
          <GarageFilters
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
            <GarageFilters
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
      )}
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
          width: isSmallScreen ? "100%" : "80%",
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
                  Vehicles
                </Typography>
                {!lgUp && !loading && (
                  <IconButton onClick={() => setToggle(!toggle)}>
                    <Icon icon="mage:filter-fill" />
                  </IconButton>
                )}
              </Stack>
            </Grid>

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
              <GarageList products={dataFiltered} loading={loading} />
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
  // return inputData;
  const min = priceRange[0];

  const max = priceRange[1];

  const minYear = year[0];
  const maxYear = year[1];

  const minMileage = mileage[0];
  const maxMileage = mileage[1];

  // FILTERS

  if (category !== "all") {
    inputData = inputData.filter(
      (product) => product?.category?.toUpperCase() === category?.toUpperCase()
    );
  }

  inputData = inputData.filter(
    (product) => Number(product.price) >= min && Number(product.price) <= max
  );

  if (minYear >= 0 || maxYear <= new Date().getFullYear()) {
    inputData = inputData.filter(
      (product) =>
        Number(product.carDetails?.yearOfManufacture) >= minYear &&
        Number(product.carDetails?.yearOfManufacture) <= maxYear
    );
  }

  if (searchByTitle) {
    inputData = inputData.filter((product) =>
      product.title?.toLowerCase().includes(searchByTitle?.toLowerCase())
    );
  }

  if (fuelType) {
    inputData = inputData.filter((product) =>
      product.carDetails.fuelType
        ?.toLowerCase()
        .includes(fuelType?.toLowerCase())
    );
  }

  if (minMileage >= 0 || maxMileage <= 200000000) {
    inputData = inputData.filter(
      (product) =>
        Number(product.carDetails?.mileage) >= Number(minMileage) &&
        Number(product.carDetails?.mileage) <= Number(maxMileage)
    );
  }

  if (makeType) {
    inputData = inputData.filter((product) =>
      product.carDetails.makeType
        ?.toLowerCase()
        .includes(makeType?.toLowerCase())
    );
  }

  inputData = inputData.filter((p) => p.status !== "Paused");

  // if (rating) {
  //   inputData = inputData.filter((product) => {
  //     const convertRating = (value) => {
  //       if (value === "up4Star") return 4;
  //       if (value === "up3Star") return 3;
  //       if (value === "up2Star") return 2;
  //       return 1;
  //     };
  //     return product.totalRatings > convertRating(rating);
  //   });
  // }

  console.log("inputData: ", inputData);

  return inputData;
}
