import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  CardContent,
  Card,
  Stack,
  Button,
} from "@mui/material";
import ProductItem from "src/sections/product/product-item";
import { ProductItemSkeleton } from "src/sections/product/product-skeleton";
import ProductService from "src/services/products/products.service";
import { WhatsApp } from "@mui/icons-material";

// Custom ProductList for Latest Products with horizontal slide view
const LatestProductsList = ({ products, loading }) => {
  const renderSkeleton = (
    <>
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
    </>
  );

  const renderList = (
    <>
      {products.map((product) => (
        <Box
          key={product._id}
          sx={{
            flexShrink: 0,
            width: { xs: "280px", sm: "320px" },
            scrollSnapAlign: "start",
          }}>
          <ProductItem product={product} />
        </Box>
      ))}
    </>
  );

  return (
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
      {loading ? renderSkeleton : renderList}
    </Box>
  );
};

export default function LatestProductsSection() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Sort by createdAt descending if available, else just take first 4
        if (products && products.length > 0) {
          // If products have a createdAt field, sort by it
          if (products[0]?.createdAt) {
            products = products
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
          }
          setLatestProducts(products.slice(0, 4));
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

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "black",
        minHeight: "600px",
      }}>
           <Box
          sx={{
            width: "100%",
            mt: "32px",
            display: { md: "block", xs: "none" },
          }}>
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
                    From genuine OEM parts to aftermarket upgrades, we source
                    and import quality car parts for all brands.
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
      <Box sx={{ position: "relative", zIndex: 2 }}>
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
          <ProductList
            products={latestProducts}
            loading={loading}
            itemsPerPage={4}
          />
        </Grid>
     
      </Box>
    </Container>
  );
}
