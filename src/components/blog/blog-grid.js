import { Grid } from "@mui/material";
import BlogCard from "./blog-card";

// ----------------------------------------------------------------------

const BlogGrid = ({ posts, onViewDetails }) => {
  return (
    <Grid container gap={4}>
      {posts.map((post, index) => (
        <Grid key={post._id || index} item xs={12} sm={6} md={4}>
          <BlogCard post={post} onViewDetails={() => onViewDetails(post)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BlogGrid;
