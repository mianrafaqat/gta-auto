"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Grid, IconButton, Link } from "@mui/material";
import ProductItem from "src/sections/product/product-item";
import { ProductItemSkeleton } from "src/sections/product/product-skeleton";
import ProductService from "src/services/products/products.service";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iconify from "src/components/iconify";
import { useRouter } from "next/navigation";

const ExpertCar = () => {
  const [chemicalProducts, setChemicalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChemicalProducts = async () => {
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
        const filtered = products.filter(
          (product) =>
            Array.isArray(product.categories) &&
            product.categories.some(
              (cat) =>
                cat &&
                (cat.name?.toLowerCase() === "chemicals" ||
                  cat.slug?.toLowerCase() === "chemicals")
            )
        );
        setChemicalProducts(filtered);
      } catch (error) {
        setChemicalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChemicalProducts();
  }, []);

  // Calculate slidesToShow based on available products
  const getSlidesToShow = (defaultValue) => {
    return Math.min(defaultValue, chemicalProducts.length);
  };

  // Check if we have only one product
  const isSingleProduct = chemicalProducts.length === 1;

  const sliderSettings = {
    dots: false,
    infinite: chemicalProducts.length > 4,
    speed: 500,
    slidesToShow: getSlidesToShow(4),
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: getSlidesToShow(3),
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: getSlidesToShow(2),
          slidesToScroll: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box sx={{ py: 8, px: 0 }}>
      <Box
        sx={{
          maxWidth: "900px",
          width: "100%",
          mb: 6,
          display: { xs: "none", md: "block" },
        }}>
        <Typography
          variant="h1"
          fontSize={{ md: "42px !important", xs: "24px !important" }}>
          Expert Car Detailing: From Luxury brands to your everyday ride in
          pakistan
        </Typography>
      </Box>

      <Box sx={{ width: "100%", mx: "auto" }}>
        <Grid item xs={12}>
          {loading ? (
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
          ) : chemicalProducts.length === 0 ? (
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
          ) : (
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
                    <ProductItem product={chemicalProducts[0]} />
                  </Box>
                </Box>
              ) : (
                // Multiple products - use slider
                <Box
                  sx={{
                    mt: { md: 0, xs: "82px" },
                    "& .slick-list": {
                      margin: { xs: "0 -4px", md: "0 -8px" },
                    },
                    "& .slick-slide > div": {
                      padding: { xs: "0 4px", md: "0 8px" },
                    },
                  }}>
                  <Slider
                    key={`slider-${chemicalProducts.length}`}
                    ref={sliderRef}
                    {...sliderSettings}
                    style={{ width: "100%", display: "flex !important" }}>
                    {chemicalProducts.map((product) => (
                      <Box
                        key={product._id}
                        sx={{
                          display: "flex !important",
                          height: "100%",
                        }}>
                        <ProductItem product={product} />
                      </Box>
                    ))}
                  </Slider>
                </Box>
              )}

              {/* Custom Navigation - View All on Mobile, Arrows on Desktop */}
              {!isSingleProduct && (
                <>
                  {/* View All Link for Mobile */}
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      position: "absolute",
                      top: -60,
                      right: 10,
                      zIndex: 10,
                    }}>
                    <Link
                      onClick={() => router.push("/shop")}
                      sx={{
                        color: "#4caf50",
                        fontWeight: 600,
                        fontSize: "14px",
                        textDecoration: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}>
                      View All
                      <Iconify
                        icon="eva:arrow-forward-fill"
                        sx={{ fontSize: 20 }}
                      />
                    </Link>
                  </Box>

                  {/* Navigation Arrows for Desktop */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      position: "absolute",
                      top: -60,
                      right: 10,
                      gap: 1,
                      zIndex: 10,
                    }}>
                    <IconButton
                      onClick={() => sliderRef.current?.slickPrev()}
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
                      onClick={() => sliderRef.current?.slickNext()}
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
                </>
              )}
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ExpertCar;
