import { Box, Typography } from "@mui/material";

// ----------------------------------------------------------------------

const BlogHeader = () => {
  return (
    <Box sx={{ textAlign: "center", mb: 8 }}>
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#4CAF50",
        }}>
        Our Blog
      </Typography>
      <Typography variant="h6" color="#fff" sx={{ maxWidth: 600, mx: "auto" }}>
        Discover insights, tips, and stories from our team and community
      </Typography>
    </Box>
  );
};

export default BlogHeader;
