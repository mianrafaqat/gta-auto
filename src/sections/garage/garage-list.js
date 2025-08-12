import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { paths } from "src/routes/paths";
import GarageItem from "./garage-item";
import { GarageItemSkeleton } from "./garage-skeleton";

export default function GarageList({
  products,
  loading,
  itemsPerPage = 8,
  ...other
}) {
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the index range for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products?.length);

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
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{
            mt: 8,
            justifyContent: "center",
          }}
        />
      )}
    </>
  );
}

GarageList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  itemsPerPage: PropTypes.number,
};
