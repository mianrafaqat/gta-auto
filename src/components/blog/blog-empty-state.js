import { Box, Container, Typography } from "@mui/material";

// ----------------------------------------------------------------------

const BlogEmptyState = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2, color: "text.secondary" }}>
          No Blog Posts Yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We're working on creating amazing content for you. Check back soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default BlogEmptyState;
