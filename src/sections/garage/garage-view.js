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
import { Button, Card, CardContent } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";

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
            position: "sticky",
            top: "120px",
            mb: "30px",
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
              bgcolor: "#000",
            },
          }}>
          <Box sx={{ bgcolor: "#000" }}>
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
              <Box>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%), url('/assets/convertable.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 4,
                    mb: 4,
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)",
                      zIndex: 1,
                    },
                  }}>
                  <CardContent
                    sx={{
                      p: { xs: 4, md: 8 },
                      textAlign: "center",
                      position: "relative",
                      zIndex: 2,
                    }}>
                    <Typography
                      variant="h2"
                      sx={{
                        color: "#4caf50",
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: "2rem", md: "3.5rem" },
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        lineHeight: 1.2,
                      }}>
                      Import Your Dream Car
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        color: "#ffffff",
                        mb: 4,
                        fontWeight: 400,
                        opacity: 0.9,
                        maxWidth: 800,
                        mx: "auto",
                        lineHeight: 1.6,
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                      }}>
                      From luxury brands to your everyday ride, we make
                      importing your dream car a reality. Expert guidance,
                      competitive pricing, and seamless process.
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={3}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
                        onClick={() => {
                          const message =
                            "Hi! I'm interested in importing my dream car. Can you help me with the process?";
                          const whatsappUrl = `https://wa.me/923263333456?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, "_blank");
                        }}
                        sx={{
                          backgroundColor: "#25D366",
                          color: "#ffffff",
                          px: 4,
                          py: 2,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          borderRadius: "50px",

                          minWidth: 250,
                        }}>
                        Chat on WhatsApp
                      </Button>
                    </Stack>

                    {/* Features */}
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={3}
                      justifyContent="center"
                      sx={{ mt: 6 }}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                        }}>
                        <Icon
                          icon="mdi:car-sports"
                          style={{
                            fontSize: "2.5rem",
                            color: "#4caf50",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ffffff",
                            fontWeight: 600,
                            mb: 1,
                          }}>
                          All Brands
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#ffffff",
                            opacity: 0.8,
                          }}>
                          From luxury to economy
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                        }}>
                        <Icon
                          icon="mdi:shield-check"
                          style={{
                            fontSize: "2.5rem",
                            color: "#4caf50",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ffffff",
                            fontWeight: 600,
                            mb: 1,
                          }}>
                          Secure Process
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#ffffff",
                            opacity: 0.8,
                          }}>
                          Safe and reliable
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                        }}>
                        <Icon
                          icon="mdi:currency-usd"
                          style={{
                            fontSize: "2.5rem",
                            color: "#4caf50",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ffffff",
                            fontWeight: 600,
                            mb: 1,
                          }}>
                          Best Prices
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#ffffff",
                            opacity: 0.8,
                          }}>
                          Competitive rates
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
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
