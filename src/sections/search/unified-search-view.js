"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CarsService } from "src/services";
import ProductService from "src/services/products/products.service";
import EmptyContent from "src/components/empty-content";
import GarageList from "src/sections/garage/garage-list";
import ShopProductList from "src/sections/product/Shop-product-list";

// ----------------------------------------------------------------------

export default function UnifiedSearchView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchText = searchParams.get("searchText") || "";
  const [activeTab, setActiveTab] = useState(0);

  // Fetch cars with React Query
  const {
    data: allCars = [],
    isLoading: carsLoading,
    refetch: refetchCars,
  } = useQuery({
    queryKey: ["cars", "search", searchText],
    queryFn: async () => {
      const res = await CarsService.getAll();
      if (res?.data) {
        return res?.data?.filter((c) => c?.status !== "Paused") || [];
      }
      return [];
    },
    enabled: !!searchText,
  });

  // Fetch products
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", "search", searchText],
    queryFn: async () => {
      const response = await ProductService.getAll({
        search: searchText,
        limit: 50,
      });
      return response?.products || response?.data || [];
    },
    enabled: !!searchText,
  });

  // Filter cars based on search text
  const filteredCars = allCars.filter((car) => {
    if (!searchText) return false;
    const searchLower = searchText.toLowerCase();
    const titleMatch = car.title?.toLowerCase().includes(searchLower);
    const makeMatch = car.carDetails?.makeType?.toLowerCase().includes(searchLower);
    const modelMatch = car.carDetails?.model?.toLowerCase().includes(searchLower);
    const descriptionMatch = car.description?.toLowerCase().includes(searchLower);
    const categoryMatch = car.category?.toLowerCase().includes(searchLower);
    
    return titleMatch || makeMatch || modelMatch || descriptionMatch || categoryMatch;
  });

  // Filter products based on search text
  const filteredProducts = (productsData || []).filter((product) => {
    if (!searchText) return false;
    const searchLower = searchText.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
    const categoryMatch = product.categories?.some((cat) =>
      cat.name?.toLowerCase().includes(searchLower)
    );
    
    return nameMatch || descriptionMatch || categoryMatch;
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const totalResults = filteredCars.length + filteredProducts.length;
  const isLoading = carsLoading || productsLoading;

  return (
    <Box sx={{ mt: "100px", mb: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: "#fff" }}>
            Search Results
          </Typography>
          
          {searchText && (
            <Typography variant="h5" sx={{ color: "#aaa" }}>
              Showing results for: <strong>"{searchText}"</strong>
            </Typography>
          )}

          {!searchText && (
            <Typography variant="body1" sx={{ color: "#aaa" }}>
              Please enter a search query
            </Typography>
          )}

          {searchText && !isLoading && (
            <Typography variant="body1" sx={{ color: "#4CAF50" }}>
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} ({filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""}, {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""})
            </Typography>
          )}
        </Stack>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#4CAF50" }} />
          </Box>
        )}

        {/* Results Tabs */}
        {!isLoading && searchText && totalResults > 0 && (
          <Box>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 4,
                "& .MuiTab-root": {
                  color: "#aaa",
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                "& .Mui-selected": {
                  color: "#4CAF50 !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#4CAF50",
                },
              }}>
              <Tab label={`All (${totalResults})`} />
              <Tab label={`Cars (${filteredCars.length})`} />
              <Tab label={`Products (${filteredProducts.length})`} />
            </Tabs>

            {/* Tab Content */}
            {activeTab === 0 && (
              <Box>
                {/* Cars Section */}
                {filteredCars.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ color: "#fff", mb: 3 }}>
                      Cars ({filteredCars.length})
                    </Typography>
                    <GarageList products={filteredCars} loading={false} />
                  </Box>
                )}

                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ color: "#fff", mb: 3 }}>
                      Products ({filteredProducts.length})
                    </Typography>
                    <Grid container spacing={3}>
                      {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
                          <Card
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
                              },
                            }}
                            onClick={() => router.push(`/product/${product._id || product.id}`)}>
                            <Box
                              sx={{
                                position: "relative",
                                paddingTop: "100%",
                                overflow: "hidden",
                              }}>
                              <Box
                                component="img"
                                src={product.images?.[0]?.url || product.image || "/assets/placeholder.svg"}
                                alt={product.name}
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                            <Box sx={{ p: 2 }}>
                              <Typography variant="h6" noWrap>
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {product.description}
                              </Typography>
                              <Typography variant="h6" sx={{ color: "#4CAF50", mt: 1 }}>
                                PKR {product.price?.toLocaleString()}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                {filteredCars.length > 0 ? (
                  <GarageList products={filteredCars} loading={false} />
                ) : (
                  <EmptyContent
                    filled
                    title="No Cars Found"
                    description={`No cars match "${searchText}"`}
                    sx={{ py: 10, color: "#fff" }}
                  />
                )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                {filteredProducts.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
                            },
                          }}
                          onClick={() => router.push(`/product/${product._id || product.id}`)}>
                          <Box
                            sx={{
                              position: "relative",
                              paddingTop: "100%",
                              overflow: "hidden",
                            }}>
                            <Box
                              component="img"
                              src={product.images?.[0]?.url || product.image || "/assets/placeholder.svg"}
                              alt={product.name}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="h6" noWrap>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {product.description}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#4CAF50", mt: 1 }}>
                              PKR {product.price?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyContent
                    filled
                    title="No Products Found"
                    description={`No products match "${searchText}"`}
                    sx={{ py: 10, color: "#fff" }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}

        {/* No Results */}
        {!isLoading && searchText && totalResults === 0 && (
          <EmptyContent
            filled
            title="No Results Found"
            description={`No cars or products match "${searchText}". Try different keywords.`}
            sx={{ py: 10, color: "#fff" }}
          />
        )}
      </Container>
    </Box>
  );
}

