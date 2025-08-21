"use client";

import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import ProductService from "src/services/products/products.service";

import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import CartIcon from "../common/cart-icon";
import { useCheckoutContext } from "../../checkout/context";
import ProductDetailsReview from "../product-details-review";
import { ProductDetailsSkeleton } from "../product-skeleton";
import ProductDetailsSummary from "../product-details-summary";
import ProductDetailsCarousel from "../product-details-carousel";
import ProductDetailsDescription from "../product-details-description";
import ShopDetailSummary from "../shop-detail-summary";
import HeroBottom from "src/components/heroBottom";
import {
  HeadphonesOutlined,
  LocalShippingOutlined,
  MonetizationOnOutlined,
  WalletOutlined,
  WorkspacePremium,
} from "@mui/icons-material";
import Discounted from "src/components/discounted";
import CategoryOffers from "src/sections/categoryOffers";
import RecentlyPurchased from "src/components/recently-purchased";
import BrowseVideosSection from "src/components/cars-filters/browse-videos";
import CTA from "src/components/cta";

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: "100% Original",
    description: "Chocolate bar candy canes ice cream toffee cookie halvah.",
    icon: "solar:verified-check-bold",
  },
  {
    title: "10 Day Replacement",
    description: "Marshmallow biscuit donut dragée fruitcake wafer.",
    icon: "solar:clock-circle-bold",
  },
  {
    title: "Year Warranty",
    description: "Cotton candy gingerbread cake I love sugar sweet.",
    icon: "solar:shield-check-bold",
  },
];

// ----------------------------------------------------------------------

export default function ProductShopDetailsView({ id }) {
  const settings = useSettingsContext();
  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // Safety check for checkout context
  if (!checkout) {
    console.log("Checkout context is not available");
    return (
      <Container maxWidth="lg">
        <div>Loading checkout...</div>
      </Container>
    );
  }

  // Safety check for settings context
  if (!settings) {
    console.log("Settings context is not available");
    return (
      <Container maxWidth="lg">
        <div>Loading settings...</div>
      </Container>
    );
  }

  console.log(
    "Contexts loaded - checkout:",
    !!checkout,
    "settings:",
    !!settings
  );

  // Fetch product data using ProductService
  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setProductLoading(true);
      setProductError(null);

      const response = await ProductService.getById(id);

      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      console.log(
        "Response keys:",
        response ? Object.keys(response) : "No response"
      );

      if (response) {
        // Check different possible response structures
        if (response.product) {
          console.log("Using response.product structure");
          setProduct(response.product);
        } else if (response.data && response.data.product) {
          console.log("Using response.data.product structure");
          setProduct(response.data.product);
        } else if (response.data) {
          console.log("Using response.data structure");
          setProduct(response.data);
        } else {
          console.log("No product data found in response");
          setProductError(new Error("Product not found"));
        }
      } else {
        console.log("No response received");
        setProductError(new Error("Product not found"));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProductError(error);
    } finally {
      setProductLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Debug log to help identify the issue
  console.log("Product details view:", {
    id,
    product,
    productLoading,
    productError,
  });

  // Debug log for API response structure
  useEffect(() => {
    if (product) {
      console.log("Product data structure:", product);
    }
  }, [product]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={productError?.message || "Product not found"}
      action={
        <Button
          component={RouterLink}
          href={paths.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}>
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = product && (
    <>
      {console.log("Rendering product:", product.name)}
      <CustomBreadcrumbs
        links={[
          { name: "Home", href: "/" },
          {
            name: "Products",
            href: paths.product.root,
          },
          { name: product?.name || "Product Details" },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={6}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <ShopDetailSummary
            product={product}
            items={checkout.items}
            onAddCart={checkout.onAddToCart}
            onGotoStep={checkout.onGotoStep}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <HeroBottom />
      </Box>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        sx={{ my: 10 }}>
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: "center", px: 5 }}>
            <Iconify
              icon={item.icon}
              width={32}
              sx={{ color: "primary.main" }}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 1, mt: 2, color: "#fff" }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: "#fff" }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card
        sx={{
          backgroundColor: "#000",
          border: "1px solid #fff",
          borderRadius: "8px",
          overflow: "hidden",
          pt: "47px",
        }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            backgroundColor: "#000",
            borderBottom: "1px solid #fff",
            justifyContent: "center",
            "& .MuiTabs-indicator": {
              backgroundColor: "#4CAF50",
              height: "3px",
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}>
          {[
            {
              value: "description",
              label: "DESCRIPTION",
            },
            {
              value: "additional",
              label: "ADDITIONAL INFORMATION",
            },
            {
              value: "specification",
              label: "SPECIFICATION",
            },
            {
              value: "reviews",
              label: "REVIEW",
            },
          ].map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              sx={{
                color: currentTab === tab.value ? "#000" : "#828282",
                backgroundColor:
                  currentTab === tab.value ? "#fff" : "transparent",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
                padding: "16px 24px",
                "&.Mui-selected": {
                  color: "#000",
                  backgroundColor: "#fff",
                },
                "&:hover": {
                  backgroundColor:
                    currentTab === tab.value ? "#fff" : "rgba(255,255,255,0.1)",
                },
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: "40px" }}>
          {currentTab === "description" && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ pr: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      mb: 2,
                      fontSize: "18px",
                    }}>
                    Description
                  </Typography>
                  <ProductDetailsDescription
                    description={product?.description}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ borderRight: "1px solid #333", pr: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      mb: 2,
                      fontSize: "18px",
                    }}>
                    Feature
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      {
                        icon: <WorkspacePremium sx={{ color: "#4CAF50" }} />,
                        text: "Free 1 Year Warranty",
                      },
                      {
                        icon: (
                          <LocalShippingOutlined sx={{ color: "#4CAF50" }} />
                        ),
                        text: "Free Shipping & Fast Delivery",
                      },
                      {
                        icon: (
                          <MonetizationOnOutlined sx={{ color: "#4CAF50" }} />
                        ),
                        text: "100% Money-back guarantee",
                      },
                      {
                        icon: <HeadphonesOutlined sx={{ color: "#4CAF50" }} />,
                        text: "24/7 Customer support",
                      },
                      {
                        icon: <WalletOutlined sx={{ color: "#4CAF50" }} />,
                        text: "Secure payment method",
                      },
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {feature.icon}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4CAF50",
                            fontSize: "14px",
                          }}>
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      mb: 2,
                      fontSize: "18px",
                    }}>
                    Shipping Information
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      "Courier: 2-4 days, free shipping",
                      "Local Shipping: up to one week, $19.00",
                      "UPS Ground Shipping: 4-6 days, $29.00",
                      "Unishop Global Export: 3-4 days, $39.00",
                    ].map((shipping, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          color: "#fff",
                          fontSize: "14px",
                        }}>
                        {shipping}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "additional" && (
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                textAlign: "center",
                py: 4,
              }}>
              Additional information will be displayed here.
            </Typography>
          )}

          {currentTab === "specification" && (
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                textAlign: "center",
                py: 4,
              }}>
              Product specifications will be displayed here.
            </Typography>
          )}

          {currentTab === "reviews" && product && (
            <ProductDetailsReview
              ratings={product.ratings || []}
              reviews={product.reviews || []}
              totalRatings={product.totalRatings || 0}
              totalReviews={product.totalReviews || 0}
            />
          )}
        </Box>
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "lg"}
      sx={{
        mt: 5,
        mb: 15,
      }}>
      {/* <CartIcon totalItems={checkout.totalItems} /> */}

      {console.log(
        "Final render - productLoading:",
        productLoading,
        "productError:",
        productError,
        "product:",
        !!product,
        "productData:",
        product
      )}

      {productLoading && renderSkeleton}

      {productError && renderError}

      {!productLoading && !productError && !product && (
        <EmptyContent
          filled
          title="Product not found"
          action={
            <Button
              component={RouterLink}
              href={paths.product.root}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
              sx={{ mt: 3 }}>
              Back to List
            </Button>
          }
          sx={{ py: 10 }}
        />
      )}

      {product && renderProduct}
      <Discounted />
      <CategoryOffers />
      <RecentlyPurchased />
      <BrowseVideosSection />
      <CTA />
    </Container>
  );
}

ProductShopDetailsView.propTypes = {
  id: PropTypes.string,
};
