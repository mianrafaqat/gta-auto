import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Markdown from "src/components/markdown";

// ----------------------------------------------------------------------

export default function ProductDetailsDescription({ description }) {
  if (!description) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No description available for this product.
        </Typography>
      </Box>
    );
  }

  return (
    <Markdown
      children={description}
      sx={{
        p: 3,
        "& p, li, ol": {
          typography: "body2",
        },
        "& ol": {
          p: 0,
          display: { md: "flex" },
          listStyleType: "none",
          "& li": {
            "&:first-of-type": {
              minWidth: 240,
              mb: { xs: 0.5, md: 0 },
            },
          },
        },
      }}
    />
  );
}

ProductDetailsDescription.propTypes = {
  description: PropTypes.string,
};
