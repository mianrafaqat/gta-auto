import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { paths } from "src/routes/paths";
import GarageItem from "./garage-item";
import { GarageItemSkeleton } from "./garage-skeleton";

export default function GarageList({
  products,
  loading,
  itemsPerPage = 6,
  ...other
}) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when products change (e.g., when filters are applied)
  useEffect(() => {
    setPage(1);
  }, [products]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the index range for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products?.length);

  // Debug log to see how many products we have
  console.log('GarageList - Total products:', products?.length, 'Items per page:', itemsPerPage, 'Current page:', page);

  const renderSkeleton = (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <GarageItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.slice(startIndex, endIndex).map((product) => (
        <GarageItem key={product._id} product={product} />
      ))}
    </>
  );

  return (
    <>
      {/* Products count display */}
      {!loading && products?.length > 0 && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} vehicles
          </Typography>
        </Box>
      )}

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        {...other}>
        {loading ? renderSkeleton : renderList}
      </Box>

      {products.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(products.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: '#25D366',
                  color: '#000',
                },
                '&:hover': {
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
}

GarageList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  itemsPerPage: PropTypes.number,
};
