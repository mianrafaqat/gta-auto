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
import { useSearchParams } from "next/navigation";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";
import { useDebounce } from "src/hooks/use-debounce";

import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from "src/_mock";

import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";

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
import GarageSort from "../garage/garage-sort";
import GarageList from "../garage/garage-list";
import GarageFilters from "../garage/garage-filter";
import { Button, Card, CardContent } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";

const FUEL_TYPES_LIST = ["Diesel", "Petrol", "Hybrid Electric", "Electric"];

// ----------------------------------------------------------------------

export default function RentView() {
  const searchParams = useSearchParams();
  
  const defaultFilters = {
    priceRange: [100000, 25000000],
    category: "rent", // Set default category to rent
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

  const openFilters = useBoolean(true);

  const [sortBy, setSortBy] = useState("featured");

  const [filters, setFilters] = useState(defaultFilters);
  const [reset, setReset] = useState(false);

  // Read search parameters from URL and apply them to filters
  useEffect(() => {
    const searchText = searchParams.get("searchText");
    const selectedCar = searchParams.get("selectedCar");
    const model = searchParams.get("model");
    const transmission = searchParams.get("transmission");

    if (searchText || selectedCar || model || transmission) {
      setFilters((prev) => ({
        ...prev,
        searchByTitle: searchText || "",
        makeType: selectedCar || "",
        // You can add model and transmission filters here if needed
      }));
    }
  }, [searchParams]);

  // Fetch all cars and filter for rent category
  const { data: allCars = [], isLoading: loading } = useQuery({
    queryKey: ["cars", "rent"],
    queryFn: async () => {
      const res = await CarsService.getAll();
      if (res?.data) {
        // Filter for rent category only
        return res?.data?.filter((c) => c?.status !== "Paused" && c?.category?.toLowerCase() === "rent") || [];
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const lgUp = useResponsive("up", "lg");

  const [toggle, setToggle] = useState(false);
  const onClose = () => setToggle(false);

  return (
    <Box sx={{ display: "flex", mt: "85px" }}>
      
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
            {/* Title */}
            <Grid item xs={12}>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "32px",
                }}>
                <Typography
                  variant="h4"
                  sx={{
                    my: { xs: 3, md: 5 },
                    color: "#fff",
                  }}>
                  Rental Cars
                </Typography>
                {!lgUp && !loading && (
                  <IconButton onClick={() => setToggle(!toggle)}>
                    <Icon icon="mage:filter-fill" />
                  </IconButton>
                )}

                <Box
                  sx={{ width: "85%", display: { md: "block", xs: "none" } }}>
                  <Card
                    sx={{
                      background: "#25D366",
                      borderRadius: 3,
                      mb: 4,
                      height: "100%",
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      },
                    }}>
                    <CardContent
                      sx={{
                        p: { xs: 4, md: "32px" },
                        textAlign: "center",
                        position: "relative",
                        zIndex: 2,
                      }}>
                      <Stack direction="row" gap={2} alignItems="center">
                        <Box>
                        <img width={560}  style={{ objectFit: "contain" }} src="/assets/bugati.png" alt="Rental Car" />

                        </Box>

                        <Box>
                          <Typography
                            variant="h2"
                            sx={{
                              color: "#000",
                              fontWeight: 700,
                              mb: 2,
                              fontSize: { xs: "2rem", md: "34px !important" },
                              lineHeight: 1.2,
                              whiteSpace: "nowrap",
                            }}>
                            Rent Your Dream Car
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#ffffff",
                              fontSize: "16px !important",
                              mb: 4,
                              fontWeight: 400,
                              opacity: 0.9,
                              maxWidth: 800,
                              mx: "auto",
                              lineHeight: 1.2,
                              textAlign: "center",
                            }}>
                            From luxury brands to your everyday ride, find the perfect rental car for your needs. Competitive rates, flexible terms, and excellent service.
                          </Typography>
                        </Box>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={3}
                          justifyContent="center"
                          alignItems="center">
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
                            onClick={() => {
                              const message =
                                "Hi! I'm interested in renting a car. Can you help me find the right vehicle?";
                              const whatsappUrl = `https://wa.me/923263333456?text=${encodeURIComponent(message)}`;
                              window.open(whatsappUrl, "_blank");
                            }}
                            sx={{
                              backgroundColor: "transparent",
                              border: "1px solid #fff",
                              color: "#000",
                              px: 4,
                              py: 2,
                              fontSize: "16px !important",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              borderRadius: "50px",
                              minWidth: 250,
                              whiteSpace: "nowrap",
                            }}>
                            Book an appointment
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            </Grid>

            {/* Render NotFound component if no results */}
            <Grid item xs={12}>
              {!dataFiltered?.length && !loading && (
                <EmptyContent
                  filled
                  title="No Rental Cars Available"
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
  
  console.log('applyFilter - Input data length:', inputData?.length);
  console.log('applyFilter - Filters:', filters);
  
  const min = priceRange[0];
  const max = priceRange[1];
  const minYear = year[0];
  const maxYear = year[1];
  const minMileage = mileage[0];
  const maxMileage = mileage[1];

  // FILTERS

  if (category && category !== "all") {
    const beforeCategory = inputData.length;
    inputData = inputData.filter(
      (product) => product?.category?.toLowerCase() === category?.toLowerCase()
    );
    console.log('applyFilter - After category filter:', beforeCategory, '->', inputData.length);
  }

  // Only apply price filter if price is not empty
  const beforePrice = inputData.length;
  inputData = inputData.filter(
    (product) => {
      const price = Number(product.price);
      const passes = !product.price || product.price === "" || (price >= min && price <= max);
      if (!passes) {
        console.log('Price filter excluded:', product.title, 'Price:', product.price, 'Min:', min, 'Max:', max);
      }
      return passes;
    }
  );
  console.log('applyFilter - After price filter:', beforePrice, '->', inputData.length);

  if (minYear >= 0 || maxYear <= new Date().getFullYear()) {
    const beforeYear = inputData.length;
    inputData = inputData.filter(
      (product) => {
        const year = product.carDetails?.yearOfManufacture;
        const passes = !year || year === "N/A" || (Number(year) >= minYear && Number(year) <= maxYear);
        if (!passes) {
          console.log('Year filter excluded:', product.title, 'Year:', year, 'Min:', minYear, 'Max:', maxYear);
        }
        return passes;
      }
    );
    console.log('applyFilter - After year filter:', beforeYear, '->', inputData.length);
  }

  if (searchByTitle) {
    const searchLower = searchByTitle?.toLowerCase();
    inputData = inputData.filter((product) => {
      // Search across multiple fields for better results
      const titleMatch = product.title?.toLowerCase().includes(searchLower);
      const makeMatch = product.carDetails?.makeType?.toLowerCase().includes(searchLower);
      const modelMatch = product.carDetails?.model?.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.toLowerCase().includes(searchLower);
      
      return titleMatch || makeMatch || modelMatch || descriptionMatch || categoryMatch;
    });
  }

  if (fuelType) {
    inputData = inputData.filter((product) =>
      product.carDetails.fuelType
        ?.toLowerCase()
        .includes(fuelType?.toLowerCase())
    );
  }

  if (minMileage >= 0 || maxMileage <= 200000000) {
    const beforeMileage = inputData.length;
    inputData = inputData.filter(
      (product) => {
        const mileage = product.carDetails?.mileage;
        const passes = !mileage || mileage === "N/A" || (Number(mileage) >= Number(minMileage) && Number(mileage) <= Number(maxMileage));
        if (!passes) {
          console.log('Mileage filter excluded:', product.title, 'Mileage:', mileage, 'Min:', minMileage, 'Max:', maxMileage);
        }
        return passes;
      }
    );
    console.log('applyFilter - After mileage filter:', beforeMileage, '->', inputData.length);
  }

  if (makeType) {
    inputData = inputData.filter((product) =>
      product.carDetails.makeType
        ?.toLowerCase()
        .includes(makeType?.toLowerCase())
    );
  }

  inputData = inputData.filter((p) => p.status !== "Paused");

  console.log('applyFilter - Final result:', inputData.length, 'cars');
  return inputData;
}

