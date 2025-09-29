import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Pagination from "@mui/material/Pagination";
import { ProductItemSkeleton } from "./product-skeleton";
import { paths } from "src/routes/paths";
import ShopProductCard from "./shop-product-card";
import ProductSort from "./product-sort";
import Iconify from "src/components/iconify";
import { PRODUCT_SORT_OPTIONS } from "src/_mock";

export default function ShopProductList({
  products,
  loading,
  itemsPerPage = 12,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onAddOrRemoveFav = () => {},
  serverPagination = false,
  onSearch = () => {},
  onSort = () => {},
  ...other
}) {
  // Local state for search and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Handle search
  const handleSearch = useCallback((event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  }, [onSearch]);

  // Handle sort
  const handleSort = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    onSort(newSortBy);
  }, [onSort]);

  // Filter and sort products locally
  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = products || [];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filteredProducts = [...filteredProducts].sort((a, b) => 
          new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
        );
        break;
      case "priceAsc":
        filteredProducts = [...filteredProducts].sort((a, b) => 
          (a.price || 0) - (b.price || 0)
        );
        break;
      case "priceDesc":
        filteredProducts = [...filteredProducts].sort((a, b) => 
          (b.price || 0) - (a.price || 0)
        );
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    return filteredProducts;
  }, [products, searchQuery, sortBy]);

  // Handle pagination change
  const handlePageChange = (event, value) => {
    console.log(`Changing to page ${value}, total pages: ${totalPages || Math.ceil(filteredAndSortedProducts.length / itemsPerPage)}`);
    
    // Scroll to top of product list
    window.scrollTo({
      top: document.querySelector('.product-list-container')?.offsetTop || 0,
      behavior: 'smooth',
    });
    
    // Call the parent handler with the new page value
    onPageChange(value);
  };

  // For client-side pagination (fallback)
  const startIndex = serverPagination ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = serverPagination ? products.length : Math.min(startIndex + itemsPerPage, products.length);

  const renderSkeleton = (
    <>
      {[...Array(itemsPerPage || 10)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {(serverPagination ? filteredAndSortedProducts : filteredAndSortedProducts.slice(startIndex, endIndex)).map((product) => (
        <ShopProductCard
          key={product._id}
          product={product}
          onAddOrRemoveFav={onAddOrRemoveFav}
        />
      ))}
    </>
  );

  return (
    <>
      {/* Search and Sort Controls */}
      <Box sx={{ mb: 3 }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mb: 3 }}
        >
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                "& fieldset": {
                  borderColor: "#4caf50",
                },
                "&:hover fieldset": {
                  borderColor: "#4caf50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                "&::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
            }}
          />

          {/* Sort Options */}
          <Box sx={{ minWidth: 200 }}>
            <ProductSort
              sort={sortBy}
              onSort={handleSort}
              sortOptions={PRODUCT_SORT_OPTIONS}
            />
          </Box>
        </Stack>

        {/* Results Count */}
        <Box sx={{ mb: 2 }}>
          <Box
            component="span"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
          </Box>
        </Box>
      </Box>

      {/* Product Grid */}
      <Box
        className="product-list-container"
        gap={{ xs: 2, md: 3 }}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        {...other}>
        {loading ? renderSkeleton : renderList}
      </Box>

      {/* Show pagination only when:
          1. No search query (showing all products), OR
          2. Search query exists but results are many (more than itemsPerPage) */}
      {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 && 
       (!searchQuery || filteredAndSortedProducts.length > itemsPerPage) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 5, mb: 5 }}>
          <Pagination
            count={serverPagination ? totalPages : Math.ceil(filteredAndSortedProducts.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
                fontSize: '1.2rem',
                '&.Mui-selected': {
                  backgroundColor: '#4caf50',
                  fontWeight: 'bold',
                }
              },
              '& .MuiPaginationItem-page': {
                border: '1px solid #4caf50',
              }
            }}
          />
        </Box>
      )}
    </>
  );
}

ShopProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onAddOrRemoveFav: PropTypes.func,
  onSearch: PropTypes.func,
  onSort: PropTypes.func,
  serverPagination: PropTypes.bool,
};
