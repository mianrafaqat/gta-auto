"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Alert,
  Skeleton,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import ProductService from "src/services/products/products.service";
import CategoryService from "src/services/category/category.service";
import EmptyContent from "src/components/empty-content";
import ShopProductList from "src/sections/product/Shop-product-list";
import ProductFiltersNew from "src/components/product-filters-new";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function CategoryView({ categorySlug }) {
  const router = useRouter();

  // States
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalItems: 0,
  });

  // Default filters for the category page
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

  const [filters, setFilters] = useState(defaultFilters);

  // Fetch category details
  const fetchCategory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First get all categories to find by slug
      const response = await CategoryService.getAll();
      let categoriesData = [];

      if (response?.data?.success) {
        categoriesData = response.data.data || [];
      } else if (response?.data?.data) {
        categoriesData = response.data.data || [];
      } else if (Array.isArray(response?.data)) {
        categoriesData = response.data || [];
      } else if (Array.isArray(response)) {
        categoriesData = response || [];
      }

      // Flatten categories to find by slug
      const flattenCategories = (cats) => {
        let flattened = [];
        cats.forEach((cat) => {
          flattened.push(cat);
          if (cat.children && cat.children.length > 0) {
            flattened = flattened.concat(flattenCategories(cat.children));
          }
        });
        return flattened;
      };

      const allCategories = flattenCategories(categoriesData);
      const foundCategory = allCategories.find(
        (cat) => cat.slug === categorySlug || cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );

      if (!foundCategory) {
        setError("Category not found");
        setCategory(null);
      } else {
        setCategory(foundCategory);
        // Update filters with the category
        setFilters(prev => ({
          ...prev,
          category: foundCategory.name,
        }));
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      setError("Failed to load category");
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  // Fetch products for the category
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setProductsLoading(true);
        const response = await ProductService.getAll({
          page,
          limit: pagination.limit,
          ...filters,
        });

        if (response && response.products) {
          setProducts(response.products);

          if (response.pagination) {
            setPagination({
              page: response.pagination.page || 1,
              limit: pagination.limit,
              totalPages: response.pagination.pages || 1,
              totalItems: response.pagination.total || response.products.length,
            });
          }
        } else if (response && response.data) {
          setProducts(response.data);
          setPagination((prev) => ({
            ...prev,
            page: page,
            totalItems: response.data.length,
          }));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // Handle filter changes
  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      ...defaultFilters,
      category: category?.name || "",
    };
    setFilters(resetFilters);
  }, [category]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  // Effects
  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    if (category) {
      fetchProducts(pagination.page);
    }
  }, [fetchProducts, category]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black", minHeight: "100vh" }}>
        <Stack spacing={3}>
          {/* Breadcrumb skeleton */}
          <Skeleton variant="text" width={300} height={24} sx={{ bgcolor: "grey.800" }} />
          
          {/* Title skeleton */}
          <Skeleton variant="text" width={400} height={48} sx={{ bgcolor: "grey.800" }} />
          
          {/* Content skeleton */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: 250 }}>
              <Skeleton variant="rectangular" height={400} sx={{ bgcolor: "grey.800" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
                {[...Array(8)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={300} sx={{ bgcolor: "grey.800" }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, bgcolor: "black", minHeight: "100vh" }}>
        <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(244,67,54,0.1)", color: "#f44336" }}>
          {error}
        </Alert>
        <EmptyContent
          filled
          title="Category Not Found"
          description="The category you're looking for doesn't exist or has been removed."
          action={{
            label: "Go to Shop",
            onClick: () => router.push(paths.product.root),
          }}
          sx={{ py: 10, color: "#fff" }}
        />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "black", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ color: "grey.500" }} />}
          sx={{ mb: 3 }}
        >
          <Link
            color="inherit"
            onClick={() => router.push("/")}
            sx={{ 
              color: "grey.400", 
              cursor: "pointer",
              "&:hover": { color: "#4caf50" }
            }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => router.push(paths.product.root)}
            sx={{ 
              color: "grey.400", 
              cursor: "pointer",
              "&:hover": { color: "#4caf50" }
            }}
          >
            Shop
          </Link>
          <Typography sx={{ color: "#4caf50", fontWeight: 600 }}>
            {category?.name || categorySlug}
          </Typography>
        </Breadcrumbs>

        {/* Category Header */}
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: { xs: "28px", md: "36px" },
            }}
          >
            {category?.name || categorySlug}
          </Typography>
          
          {category?.description && (
            <Typography
              variant="body1"
              sx={{
                color: "grey.300",
                fontSize: "16px",
                maxWidth: 800,
              }}
            >
              {category.description}
            </Typography>
          )}

          {/* Products count */}
          <Typography
            variant="body2"
            sx={{
              color: pagination.totalItems === 0 && !productsLoading ? "#f44336" : "grey.400",
              fontSize: "14px",
              fontWeight: pagination.totalItems === 0 && !productsLoading ? 600 : 400,
            }}
          >
            {productsLoading 
              ? "Loading..." 
              : pagination.totalItems === 0 
                ? "No products available in this category" 
                : `${pagination.totalItems} products found`
            }
          </Typography>
        </Stack>

        {/* Main Content */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Filters Sidebar */}
          {/* <Box
            sx={{
              width: 250,
              display: { xs: "none", md: "block" },
              flexShrink: 0,
            }}
          >
            <ProductFiltersNew
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
            />
          </Box> */}

          {/* Products Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {!productsLoading && products.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  textAlign: "center",
                  py: 8,
                  px: 3,
                  border: "2px dashed",
                  borderColor: "grey.700",
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                {/* Empty State Icon */}
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Iconify
                    icon="solar:box-minimalistic-bold"
                    width={60}
                    sx={{ color: "#4caf50", opacity: 0.7 }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    mb: 2,
                    fontSize: { xs: "24px", md: "28px" },
                  }}
                >
                  No Products Found
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "grey.400",
                    mb: 4,
                    maxWidth: 500,
                    lineHeight: 1.6,
                  }}
                >
                  {/* Check if filters are applied */}
                  {Object.keys(filters).some(key => 
                    key !== 'category' && 
                    ((Array.isArray(filters[key]) && filters[key].length > 0) || 
                     (typeof filters[key] === 'string' && filters[key] !== '') ||
                     (typeof filters[key] === 'number' && filters[key] !== 0))
                  ) ? (
                    <>
                      No products match your current filters in the{" "}
                      <Box component="span" sx={{ color: "#4caf50", fontWeight: 600 }}>
                        {category?.name || categorySlug}
                      </Box>{" "}
                      category. Try adjusting your filters or browse other categories.
                    </>
                  ) : (
                    <>
                      We couldn't find any products in the{" "}
                      <Box component="span" sx={{ color: "#4caf50", fontWeight: 600 }}>
                        {category?.name || categorySlug}
                      </Box>{" "}
                      category at the moment. Try browsing other categories or check back later.
                    </>
                  )}
                </Typography>

                {/* Action Buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* Show Clear Filters button if filters are applied */}
                  {Object.keys(filters).some(key => 
                    key !== 'category' && 
                    ((Array.isArray(filters[key]) && filters[key].length > 0) || 
                     (typeof filters[key] === 'string' && filters[key] !== '') ||
                     (typeof filters[key] === 'number' && filters[key] !== 0))
                  ) && (
                    <Box
                      component="button"
                      onClick={handleResetFilters}
                      sx={{
                        px: 4,
                        py: 1.5,
                        bgcolor: "#ff9800",
                        color: "#000",
                        border: "none",
                        borderRadius: 2,
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#f57c00",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Clear Filters
                    </Box>
                  )}
                  
                  <Box
                    component="button"
                    onClick={() => router.push(paths.product.root)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: "#4caf50",
                      color: "#000",
                      border: "none",
                      borderRadius: 2,
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#45a049",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Browse All Products
                  </Box>
                  <Box
                    component="button"
                    onClick={() => router.back()}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: "transparent",
                      color: "#4caf50",
                      border: "2px solid #4caf50",
                      borderRadius: 2,
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Go Back
                  </Box>
                </Stack>
              </Box>
            ) : (
              <ShopProductList
                products={products}
                loading={productsLoading}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onAddOrRemoveFav={() => {
                  fetchProducts(pagination.page);
                }}
                serverPagination={true}
                sx={{ mb: 5 }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
