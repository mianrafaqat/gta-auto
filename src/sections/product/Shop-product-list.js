import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { ProductItemSkeleton } from "./product-skeleton";
import { paths } from "src/routes/paths";
import ShopProductCard from "./Shop-product-card";

export default function ShopProductList({
  products,
  loading,
  itemsPerPage = 8,
  onAddOrRemoveFav = () => {},
  ...other
}) {
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the index range for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products.length);

  const renderSkeleton = (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.slice(startIndex, endIndex).map((product) => (
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

ShopProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  itemsPerPage: PropTypes.number,
};
