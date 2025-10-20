"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";

import ProductService from "src/services/products/products.service";

import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";

import { useCheckoutContext } from "../../checkout/context";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useResponsive } from "src/hooks/use-responsive";
import { SplashScreen } from "src/components/loading-screen";
import { WhatsApp } from "@mui/icons-material";
import BrowseVideosSection from "src/components/cars-filters/browse-videos";
import CTA from "src/components/cta";
import ShopProductList from "../Shop-product-list";
import ShopHero from "../shop-hero";
import LatestProductsSection from "src/components/cars-filters/latest-products";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const searchParams = useSearchParams();
  
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

  const [filters, setFilters] = useState(defaultFilters);
  const [reset, setReset] = useState(false);

  // Read search parameters from URL and apply them to filters
  useEffect(() => {
    const searchText = searchParams.get("searchText");
    
    if (searchText) {
      setFilters((prev) => ({
        ...prev,
        searchByTitle: searchText,
        activeFilter: searchText,
      }));
    }
  }, [searchParams]);

  // Pagination settings
  const ITEMS_PER_PAGE = 12;
  
  // State for products and loading
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const loaderRef = useRef(null);

  // Fetch all products initially
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch a large batch of products or implement progressive loading
      const response = await ProductService.getAll({
        page: 1,
        limit: 100, // Fetch more products initially
        ...filters,
      });

      if (response && response.products) {
        setAllProducts(response.products);
        setHasMoreProducts(response.pagination?.pages > 1);
      } else if (response && response.data) {
        setAllProducts(response.data);
        setHasMoreProducts(false);
      } else {
        setAllProducts([]);
        setHasMoreProducts(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
      setHasMoreProducts(false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Update displayed products when data or page changes
  useEffect(() => {
    if (allProducts.length > 0) {
      const endIndex = page * ITEMS_PER_PAGE;
      setDisplayedProducts(allProducts.slice(0, endIndex));
    }
  }, [allProducts, page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && displayedProducts.length < allProducts.length) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, displayedProducts.length, allProducts.length]);

  const hasMore = displayedProducts.length < allProducts.length;

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

  // Use displayed products
  const dataFiltered = displayedProducts;

  const canReset = () => {
    setFilters({ ...defaultFilters });
  };


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const lgUp = useResponsive("up", "lg");

  return (
    <Box sx={{ display: "" }}>
      <ShopHero />
      {/* <HeroBottom /> */}
 <Box sx={{
        
      }}>
      <LatestProductsSection isShop={false} />
      </Box>
      <Box
        sx={{
          width: isSmallScreen ? "100%" : "100%",
          ml: isSmallScreen ? 0 : "auto",
        }}>
        <Container
          maxWidth="xl"
          sx={{
            mb: 15,
          }}>
          <Grid container>
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
                {/* <Typography
                  variant="h4"
                  sx={{
                    my: { xs: 3, md: 5 },
                    color: "#fff",
                    fontSize: "32px !important",
                  }}>
                  Shop
                </Typography> */}

                <Box
                  sx={{ width: "100%", display: { md: "block", xs: "none" } }}>
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
                        <img width={560} src="/assets/car-accessories-png-car-parts-clipart.png" alt="Comic" />
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
                            Import Your Desire Accessories
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
                            Book an appointment
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

              {/* {canReset && renderResults} */}
            </Stack>

            {/* <CategoryOffers /> */}
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
              {/* <ProductList
                products={dataFiltered}
                loading={loading}
                itemsPerPage={4}
              /> */}
              {/* <LatestProductsSection /> */}
            </Box>
            {/* <Box width="100%">
              <Discounted />
            </Box> */}

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

            <Grid container>
              <Grid item xs={12}>
                <ShopProductList
                  products={dataFiltered}
                  loading={loading}
                  loaderRef={loaderRef}
                  hasMore={hasMore}
                  onAddOrRemoveFav={() => {
                    fetchAllProducts();
                  }}
                  sx={{ my: 5 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <BrowseVideosSection />
        {/* <CTA /> */}
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
  inputData = inputData.filter((product) => {
    const productPrice = Number(product.price) || 0;
    const isInRange = productPrice >= min && productPrice <= max;
    return isInRange;
  });

  // Price range option filter (radio button selections)
  if (priceRangeOption && priceRangeOption !== "") {
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

  return inputData;
}
