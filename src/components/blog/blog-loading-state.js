import { Container, Grid, Typography } from "@mui/material";
import BlogSkeleton from "./blog-skeleton";

// ----------------------------------------------------------------------

const BlogLoadingState = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        sx={{
          mb: 6,
          textAlign: "center",
          fontWeight: 700,
          color: "#4CAF50",
        }}>
        Our Blog
      </Typography>
      <Grid container spacing={4}>
        {[...Array(6)].map((_, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <BlogSkeleton />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogLoadingState;
