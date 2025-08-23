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
import Image from "next/image";
import CategoryOffers from "src/sections/categoryOffers";
import ProductFiltersNew from "src/components/product-filters-new";
import BrowseVideosSection from "src/components/cars-filters/browse-videos";
import CTA from "src/components/cta";
import Discounted from "src/components/discounted";
import ShopProductList from "../Shop-product-list";
import ShopHero from "../shop-hero";
import HeroBottom from "src/components/heroBottom";

const FUEL_TYPES_LIST = ["Diesel", "Petrol", "Hybrid Electric", "Electric"];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const defaultFilters = {
    priceRange: [0, 50000],
    category: "",
    searchByTitle: "",
    year: [1940, new Date().getFullYear()],
    fuelType: "",
    mileage: [0, 200000000],
    makeType: "",
    availableItems: [],
    priceRangeOption: "",
    popularTags: [],
    activeFilter: "",
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
      console.error("Error fetching products:", error);
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
    <Box sx={{ display: "" }}>
      <ShopHero />
      <HeroBottom />

      <Drawer
        open={toggle}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { md: "30%", xs: "75%" },
            backgroundColor: "#000",
          },
        }}>
        <Box>
          <ProductFiltersNew
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
          />
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
                  mt: "32px",
                }}>
                <Typography
                  variant="h4"
                  sx={{
                    my: { xs: 3, md: 5 },
                    color: "#fff",
                    fontSize: "32px !important",
                  }}>
                  Shop
                </Typography>

                <Box
                  sx={{ width: "80%", display: { md: "block", xs: "none" } }}>
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
                          <img
                            src="/assets/convertable.png"
                            alt="Comic"
                            // width={450}
                            // height={150}
                          />
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
                            Import your desire accessories
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
                              maxWidth: 400,
                            }}>
                            From genuine OEM parts to aftermarket upgrades, we
                            source and import quality car parts for all brands.
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
                                "Hi! I'm interested in importing car parts. Can you help me find the parts I need?";
                              const whatsappUrl = `https://wa.me/923263331000?text=${encodeURIComponent(message)}`;
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
                            Chat on WhatsApp
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
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

            <CategoryOffers />
            <Box width="100%">
              <Box
                sx={{
                  borderBottom: "1px solid #4caf50",
                  pb: "36px",
                  width: "max-content",
                  mb: "34px",
                }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#4caf50",
                    fontWeight: "bold",
                    fontSize: { xs: "24px", md: "32px" },
                    mb: 1,
                  }}>
                  Shop Now
                </Typography>
              </Box>
              <ProductList
                products={dataFiltered}
                loading={loading}
                itemsPerPage={4}
              />
            </Box>
            <Box width="100%">
              <Discounted />
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

            <Grid container gap="0px">
              <Grid item xs={12} md={2}>
                <ProductFiltersNew
                  filters={filters}
                  onFilters={handleFilters}
                  onResetFilters={handleResetFilters}
                />
              </Grid>
              <Grid item xs={12} md={10} display={{ xs: "none", md: "block" }}>
                {/* <ProductList products={dataFiltered} loading={loading} /> */}
                <ShopProductList
                  products={dataFiltered}
                  loading={loading}
                  onAddOrRemoveFav={() => {
                    // Refetch products to get updated favorite status
                    fetchProducts();
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <BrowseVideosSection />
        <CTA />
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
    availableItems,
    priceRangeOption,
    popularTags,
    activeFilter,
  } = filters;

  const min = priceRange[0];
  const max = priceRange[1];

  // FILTERS

  // Category filter
  if (category && category !== "" && category !== "all") {
    inputData = inputData.filter((product) =>
      product?.categories?.some(
        (cat) => cat?.name?.toUpperCase() === category?.toUpperCase()
      )
    );
  }

  // Price range filter
  console.log("Price range filter - min:", min, "max:", max); // Debug log
  inputData = inputData.filter((product) => {
    const productPrice = Number(product.price) || 0;
    const isInRange = productPrice >= min && productPrice <= max;
    console.log(
      `Product: ${product.name}, Price: ${productPrice}, In Range: ${isInRange}`
    ); // Debug log
    return isInRange;
  });

  // Price range option filter (radio button selections)
  if (priceRangeOption && priceRangeOption !== "") {
    console.log("Price range option filter:", priceRangeOption); // Debug log
    inputData = inputData.filter((product) => {
      const productPrice = Number(product.price) || 0;

      let isInRange = false;
      switch (priceRangeOption) {
        case "Under Pkr.500":
          isInRange = productPrice < 500;
          break;
        case "Pkr.501 to Pkr.1,000":
          isInRange = productPrice >= 501 && productPrice <= 1000;
          break;
        case "Pkr.1,001 to Pkr.2,000":
          isInRange = productPrice >= 1001 && productPrice <= 2000;
          break;
        case "Pkr.2,001 to Pkr.5,000":
          isInRange = productPrice >= 2001 && productPrice <= 5000;
          break;
        case "Pkr.5,001 to Pkr.10,000":
          isInRange = productPrice >= 5001 && productPrice <= 10000;
          break;
        case "Above Pkr.10,000":
          isInRange = productPrice > 10000;
          break;
        case "All Price":
        default:
          isInRange = true;
          break;
      }
      console.log(
        `Product: ${product.name}, Price: ${productPrice}, Range Option: ${priceRangeOption}, In Range: ${isInRange}`
      ); // Debug log
      return isInRange;
    });
  }

  // Search filter
  if (searchByTitle) {
    inputData = inputData.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchByTitle?.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchByTitle?.toLowerCase())
    );
  }

  // Available items filter
  if (availableItems && availableItems.length > 0) {
    const checkedItems = availableItems
      .filter((item) => item.checked)
      .map((item) => item.name);
    if (checkedItems.length > 0) {
      inputData = inputData.filter((product) =>
        checkedItems.some(
          (item) =>
            product.name?.toLowerCase().includes(item.toLowerCase()) ||
            product.description?.toLowerCase().includes(item.toLowerCase())
        )
      );
    }
  }

  // Popular tags filter
  if (popularTags && popularTags.length > 0) {
    inputData = inputData.filter((product) =>
      popularTags.some(
        (tag) =>
          product.name?.toLowerCase().includes(tag.toLowerCase()) ||
          product.description?.toLowerCase().includes(tag.toLowerCase()) ||
          product.categories?.some((cat) =>
            cat.name?.toLowerCase().includes(tag.toLowerCase())
          )
      )
    );
  }

  // Active filter
  if (activeFilter && activeFilter !== "") {
    inputData = inputData.filter(
      (product) =>
        product.name?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(activeFilter.toLowerCase()) ||
        product.categories?.some((cat) =>
          cat.name?.toLowerCase().includes(activeFilter.toLowerCase())
        )
    );
  }

  // Filter by status (published products only)
  inputData = inputData.filter((p) => p.status === "published");

  console.log("Filtered products: ", inputData);

  return inputData;
}
