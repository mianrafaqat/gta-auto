import PropTypes from "prop-types";
import { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const CATEGORIES = [
  "CAR CARE",
  "INTERIOR",
  "4X4 MODIFICATION",
  "4X4 MODIFICATION",
  "4X4 MODIFICATION",
];

const PRODUCTS = [
  {
    id: 1,
    name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
    price: "$1,500",
    category: "CAR CARE",
  },
  {
    id: 2,
    name: "Simple Mobile 5G LTE Galexy 12 Mini 512GB Gaming Phone",
    price: "$1,500",
    category: "INTERIOR",
  },
  {
    id: 3,
    name: "Car Interior Multimedia Infotainment",
    price: "$1,500",
    category: "4X4 MODIFICATION",
  },
];

// ----------------------------------------------------------------------

export default function RecentlyPurchased() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const renderHeader = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}>
      <Typography
        variant="h4"
        sx={{
          color: "#4CAF50",
          fontWeight: "bold",
          fontSize: "24px",
        }}>
        Recently Purchased by Someone
      </Typography>

      <Link
        component={RouterLink}
        href={paths.product.root}
        sx={{
          display: { md: "flex", xs: "none" },
          alignItems: "center",
          gap: 1,
          color: "#999",
          textDecoration: "none",
          fontSize: "14px",
          "&:hover": {
            color: "#4CAF50",
          },
        }}>
        View All
        <Iconify
          icon="eva:arrow-ios-forward-fill"
          width={16}
          sx={{ color: "inherit" }}
        />
      </Link>
    </Box>
  );

  const renderCategoryLabels = (
    <Grid
      container
      spacing={2}
      sx={{ mb: 2, display: { xs: "none", md: "flex" } }}>
      {CATEGORIES.map((category, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Typography
            variant="body2"
            sx={{
              color: "#999",
              textTransform: "uppercase",
              fontWeight: "500",
              fontSize: "12px",
              textAlign: "center",
            }}>
            {category}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );

  const renderProductCard = (product, index) => (
    <Card
      key={`${product.category}-${index}`}
      onMouseEnter={() => setHoveredCard(`${product.category}-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "16px",
        height: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform:
          hoveredCard === `${product.category}-${index}`
            ? "translateY(-2px)"
            : "translateY(0)",
        boxShadow:
          hoveredCard === `${product.category}-${index}`
            ? "0 4px 16px rgba(0,0,0,0.2)"
            : "0 2px 8px rgba(0,0,0,0.1)",
      }}>
      <Typography
        variant="body2"
        sx={{
          color: "#000",
          fontSize: "12px",
          lineHeight: 1.4,
          fontWeight: "500",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
        {product.name}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#1976d2",
          fontSize: "14px",
          fontWeight: "bold",
          mt: "auto",
        }}>
        {product.price}
      </Typography>
    </Card>
  );

  const renderProductGrid = (
    <Grid container spacing={2}>
      {/* CAR CARE Column */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Stack spacing={2}>
          {/* Mobile Category Title */}
          <Typography
            variant="body2"
            sx={{
              color: "#999",
              textTransform: "uppercase",
              fontWeight: "500",
              fontSize: "12px",
              textAlign: "center",
              display: { xs: "block", md: "none" },
              mb: 1,
            }}>
            {CATEGORIES[0]}
          </Typography>
          {Array.from({ length: 3 }, (_, index) =>
            renderProductCard(PRODUCTS[0], index)
          )}
        </Stack>
      </Grid>

      {/* INTERIOR Column */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Stack spacing={2}>
          {/* Mobile Category Title */}
          <Typography
            variant="body2"
            sx={{
              color: "#999",
              textTransform: "uppercase",
              fontWeight: "500",
              fontSize: "12px",
              textAlign: "center",
              display: { xs: "block", md: "none" },
              mb: 1,
            }}>
            {CATEGORIES[1]}
          </Typography>
          {Array.from({ length: 3 }, (_, index) =>
            renderProductCard(PRODUCTS[1], index)
          )}
        </Stack>
      </Grid>

      {/* 4X4 MODIFICATION Columns */}
      {Array.from({ length: 3 }, (columnIndex) => (
        <Grid item xs={12} sm={6} md={2.4} key={columnIndex}>
          <Stack spacing={2}>
            {/* Mobile Category Title */}
            <Typography
              variant="body2"
              sx={{
                color: "#999",
                textTransform: "uppercase",
                fontWeight: "500",
                fontSize: "12px",
                textAlign: "center",
                display: { xs: "block", md: "none" },
                mb: 1,
              }}>
              {CATEGORIES[2 + columnIndex]}
            </Typography>
            {Array.from({ length: 3 }, (_, index) =>
              renderProductCard(PRODUCTS[2], index)
            )}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        padding: "40px 20px",
        borderRadius: "8px",
        margin: "40px 0",
      }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {renderHeader}
        {renderCategoryLabels}
        {renderProductGrid}
      </Box>
    </Box>
  );
}

RecentlyPurchased.propTypes = {};
