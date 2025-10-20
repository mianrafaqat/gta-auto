import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import GarageItem from "./garage-item";
import { GarageItemSkeleton } from "./garage-skeleton";

export default function GarageList({
  products,
  loading,
  loaderRef,
  hasMore,
  itemsPerPage = 6,
  ...other
}) {

  const renderSkeleton = (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <GarageItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.map((product) => (
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

      {/* Loading indicator for infinite scroll */}
      {hasMore && !loading && (
        <Box
          ref={loaderRef}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
            mt: 4,
          }}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      )}
    </>
  );
}

GarageList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  itemsPerPage: PropTypes.number,
  loaderRef: PropTypes.object,
  hasMore: PropTypes.bool,
};
