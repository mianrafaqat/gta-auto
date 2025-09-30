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
const LatestProductsList = ({ products, loading }) => {
  const sliderRef = useRef(null);

  // Calculate slidesToShow based on available products
  const getSlidesToShow = (defaultValue) => {
    return Math.min(defaultValue, products.length);
  };

  // Check if we have only one product
  const isSingleProduct = products.length === 1;

  const sliderSettings = {
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: getSlidesToShow(4),
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
          slidesToShow: getSlidesToShow(1),
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}>
        <Typography variant="h6" color="grey.400">
          No chemical products found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", pb: 8 }}>
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
          {/* Mobile View - Vertical Stack */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
            }}>
            <Stack spacing={3} alignItems="center">
              {products.map((product) => (
                <Box
                  key={product._id}
                  sx={{ 
                    width: "100%", 
                    maxWidth: "400px",
                    minWidth: "280px",
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <ProductItem product={product} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Desktop View - Slider */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}>
            <Slider
              key={`slider-${products.length}`}
              ref={sliderRef}
              {...sliderSettings}
              style={{ width: "100%", display: "flex !important" }}>
              {products.map((product) => (
                <Box
                  key={product._id}
                  sx={{ 
                    px: 1, 
                    display: "flex !important",
                    height: "100%",
                    minHeight: "400px"
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

      {/* Custom Navigation Buttons - Bottom Left (Desktop Only) */}
      {!isSingleProduct && products.length > 4 && (
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: 0,
            display: { xs: "none", md: "flex" },
            gap: 1,
            zIndex: 10,
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
  );
};

export default function LatestProductsSection({
  titleText = " Latest Products",
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
        const response = await ProductService.getAll();
        let products = [];
        if (response && response.products) {
          products = response.products;
        } else if (response && response.data) {
          products = response.data;
        }
        // Filter out products that have a category with name "Chemicals"
        const nonChemicalProducts = products.filter(
          (product) =>
            !Array.isArray(product.categories) ||
            !product.categories.some(
              (cat) =>
                cat &&
                (cat.name?.toLowerCase() === "chemicals" ||
                  cat.slug?.toLowerCase() === "chemicals")
            )
        );
        // Take first 10 non-chemical products
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
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "black",
        minHeight: "600px",
      }}>
       {!isShop && (<Box sx={{ position: "relative", zIndex: 2 }}>
        {/* Section Title */}
        <Typography
          variant="h3"
          sx={{
            color: "#4caf50",
            fontWeight: "bold",
            fontSize: { xs: "24px", md: "32px" },
            mb: 6,
            textTransform: "uppercase",
          }}>
          Latest Products
        </Typography>

        <Grid item xs={12}>
            <LatestProductsList products={latestProducts} loading={loading} />
          </Grid>
        </Box>
      )}

      {/* Shop Section */}
    {isShop &&  (<Box sx={{ position: "relative", zIndex: 2, mt: 8 }}>
        {/* Shop Section Title */}
        <Typography
          variant="h3"
          sx={{
            color: "#4caf50",
            fontWeight: "bold",
            fontSize: { xs: "24px", md: "32px" },
            mb: 6,
            textTransform: "uppercase",
          }}>
          Shop
        </Typography>

        <Grid item xs={12}>
          <LatestProductsList
            products={firstTenProducts}
            loading={loadingFirstTen}
          />
        </Grid>
      </Box>)}
    </Container>
  );
}
