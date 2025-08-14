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

import ProductService from "src/services/products/products.service";
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
  Button,
  Card,
  CardContent,
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
import { WhatsApp } from "@mui/icons-material";

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

  // Safety check for settings context
  if (!settings) {
    return (
      <Container maxWidth="lg">
        <div>Loading settings...</div>
      </Container>
    );
  }

  const openFilters = useBoolean(true);

  const [sortBy, setSortBy] = useState("featured");

  const [filters, setFilters] = useState(defaultFilters);
  const [reset, setReset] = useState(false);

  // State for products and loading
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products using ProductService
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAll();
      
      if (response && response.products) {
        setAllCars(response.products);
      } else if (response && response.data) {
        setAllCars(response.data);
      } else {
        setAllCars([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

            <Box sx={{ width: "100%" }}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%), url('/assets/convertable.png')`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  borderRadius: 4,
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
                    Import Car Parts
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
                    From genuine OEM parts to aftermarket upgrades, we source
                    and import quality car parts for all brands. Expert
                    sourcing, competitive pricing, and reliable delivery to keep
                    your vehicle running perfectly.
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
                          "Hi! I'm interested in importing car parts. Can you help me find the parts I need?";
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
                        icon="mdi:cog"
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
                        All Parts
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff",
                          opacity: 0.8,
                        }}>
                        Engine to body parts
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
                        Genuine Quality
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff",
                          opacity: 0.8,
                        }}>
                        OEM & aftermarket
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                      }}>
                      <Icon
                        icon="mdi:truck-delivery"
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
                        Fast Delivery
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff",
                          opacity: 0.8,
                        }}>
                        Quick shipping
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

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
