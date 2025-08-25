import { Grid } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import BlogCard from "./blog-card";

// ----------------------------------------------------------------------

// Helper function to create URL-friendly slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const BlogGrid = ({ posts }) => {
  const router = useRouter();

  const handleViewDetails = (post) => {
    // Create a URL-friendly slug from the title
    const slug = createSlug(post.title);

    // Navigate to the blog post using the slug
    router.push(`/blog/${slug}`);
  };

  return (
    <Grid container gap={4}>
      {posts.map((post, index) => (
        <Grid key={post._id || index} item xs={12} sm={6} md={4} lg={3}>
          <BlogCard post={post} onViewDetails={() => handleViewDetails(post)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BlogGrid;
