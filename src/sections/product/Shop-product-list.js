import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { ProductItemSkeleton } from "./product-skeleton";
import { paths } from "src/routes/paths";
import ShopProductCard from "./shop-product-card";

export default function ShopProductList({
  products,
  loading,
  itemsPerPage = 12,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onAddOrRemoveFav = () => {},
  serverPagination = false,
  ...other
}) {
  // Handle pagination change
  const handlePageChange = (event, value) => {
    console.log(`Changing to page ${value}, total pages: ${totalPages || Math.ceil(products.length / itemsPerPage)}`);
    
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
      {(serverPagination ? products : products.slice(startIndex, endIndex)).map((product) => (
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

      {products && products.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 5, mb: 5 }}>
          <Pagination
            count={serverPagination ? totalPages : Math.ceil(products.length / itemsPerPage)}
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
  serverPagination: PropTypes.bool,
};
