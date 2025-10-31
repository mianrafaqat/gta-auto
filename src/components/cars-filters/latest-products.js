import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  CardContent,
  Card,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import ProductItem from "src/sections/product/product-item";
import { ProductItemSkeleton } from "src/sections/product/product-skeleton";
import ProductService from "src/services/products/products.service";
import { WhatsApp } from "@mui/icons-material";
import ProductList from "src/sections/product/product-list";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iconify from "src/components/iconify";

// Custom ProductList for Latest Products with slider view
const LatestProductsList = ({ products, loading, title }) => {
  const sliderRef = useRef(null);

  // Calculate slidesToShow based on available products
  const getSlidesToShow = (defaultValue) => {
    return Math.min(defaultValue, products.length);
  };

  // Check if we have only one product
  const isSingleProduct = products.length === 1;
  const slidesToShow = title === "Addons" ? getSlidesToShow(3) : getSlidesToShow(4)
  const sliderSettings = {
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, // Disable default arrows
    variableWidth: false,
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: getSlidesToShow(3),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  if (loading) {
    return (
      <>
        {/* Section Title */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: { xs: "18px", md: "32px" },
              textTransform: "uppercase",
            }}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ position: "relative", width: "100%", pb: 8 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pb: 2,
            }}>
            {[...Array(4)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0,
                  width: { xs: "280px", sm: "320px" },
                  scrollSnapAlign: "start",
                }}>
                <ProductItemSkeleton />
              </Box>
            ))}
          </Box>
        </Box>
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        {/* Section Title */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: { xs: "12px", md: "32px" },
              textTransform: "uppercase",
            }}>
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <Typography variant="h6" color="grey.400">
            No products found
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Section Title with Navigation */}
      <Box
        sx={{
          mb: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 3, sm: 3, md: 0 },
        }}>
        <Typography
          variant="h3"
          sx={{
            color: "#4caf50",
            fontWeight: "bold",
            fontSize: { xs: "18px", md: "32px" },
            textTransform: "uppercase",
          }}>
          {title}
        </Typography>

        {!isSingleProduct && products.length > 4 && !loading && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}>
            <IconButton
              onClick={() => {
                console.log("Previous clicked, sliderRef:", sliderRef.current);
                sliderRef.current?.slickPrev();
              }}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#999",
                },
              }}>
              <Iconify
                icon="eva:arrow-back-fill"
                sx={{ fontSize: 18, color: "black" }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                console.log("Next clicked, sliderRef:", sliderRef.current);
                sliderRef.current?.slickNext();
              }}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#999",
                },
              }}>
              <Iconify
                icon="eva:arrow-forward-fill"
                sx={{ fontSize: 18, color: "black" }}
              />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ position: "relative", width: "100%", pb: { md: 8, xs: 0 } }}>
        {isSingleProduct ? (
          // Single product display - center it
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Box sx={{ maxWidth: "350px", width: "100%" }}>
              <ProductItem product={products[0]} />
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{px: { md: 0, xs: "0" }}}>
              <Slider
                key={`slider-${products.length}`}
                ref={sliderRef}
                {...sliderSettings}
                style={{ width: "100%", display: "flex !important" }}>
                {products.map((product) => (
                  <Box
                    key={product._id}
                    sx={{
                      px: { md: 1.5, xs: "4px" },
                      display: "flex !important",
                      height: "100%",
                      minHeight: { md: "400px", xs: "100%" },
                    }}>
                    <Box sx={{ width: "100%", height: "100%" }}>
                      <ProductItem product={product} />
                    </Box>
                  </Box>
                ))}
              </Slider>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default function LatestProductsSection({
  titleText,
  isShop = false,
}) {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstTenProducts, setFirstTenProducts] = useState([]);
  const [loadingFirstTen, setLoadingFirstTen] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll();
        let products = [];
        if (response && response.products) {
          products = response.products;
        } else if (response && response.data) {
          products = response.data;
        }
        // Filter products that have a category with name "Chemicals"
        let filtered = products.filter(
          (product) =>
            Array.isArray(product.categories) &&
            product.categories.some(
              (cat) =>
                cat &&
                (cat.name?.toLowerCase() === "chemicals" ||
                  cat.slug?.toLowerCase() === "chemicals")
            )
        );

        // Sort by createdAt descending if available, else just take first 4
        if (filtered && filtered.length > 0) {
          // If products have a createdAt field, sort by it
          if (filtered[0]?.createdAt) {
            filtered = filtered
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
          }
          setLatestProducts(filtered);
        } else {
          setLatestProducts([]);
        }
      } catch (error) {
        setLatestProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const fetchFirstTenProducts = async () => {
      setLoadingFirstTen(true);
      try {
        // Fetch more products to ensure we get enough non-chemical products
        const response = await ProductService.getAll({ limit: 100 });
        let products = [];
        if (response && response.products) {
          products = response.products;
        } else if (response && response.data) {
          products = response.data;
        }

        // Filter out products that have a category with name "Chemicals"
        const nonChemicalProducts = products.filter((product) => {
          const hasCategories = Array.isArray(product.categories);
          if (!hasCategories) {
            return true; // Include products without categories
          }

          const hasChemicalCategory = product.categories.some((cat) => {
            return (
              cat &&
              (cat.name?.toLowerCase() === "chemicals" ||
                cat.slug?.toLowerCase() === "chemicals")
            );
          });

          return !hasChemicalCategory;
        });

        // Take up to 40 non-chemical products
        if (nonChemicalProducts && nonChemicalProducts.length > 0) {
          setFirstTenProducts(nonChemicalProducts.slice(0, 40));
        } else {
          setFirstTenProducts([]);
        }
      } catch (error) {
        setFirstTenProducts([]);
      } finally {
        setLoadingFirstTen(false);
      }
    };

    fetchFirstTenProducts();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: {xs: 2, md: 8},
        pb: { md: 8, xs: 0 },
        px: { xs: 0, sm: 3, md: 4 },
        // backgroundColor: "black",
        minHeight: { xs: "auto", md: "600px" },
      }}>
      {!isShop && (
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Grid item xs={12}>
            <LatestProductsList 

              products={latestProducts} 
              loading={loading} 
              title={titleText}
            />
          </Grid>
        </Box>
      )}

      {/* Shop Section */}
      {isShop && (
        <Box sx={{ position: "relative", zIndex: 2, mt: {xs: 2, md: 8} }}>
          <Grid item xs={12}>
            <LatestProductsList
              products={firstTenProducts}
              loading={loadingFirstTen}
              title="Shop"
            />
          </Grid>
        </Box>
      )}
    </Container>
  );
}
