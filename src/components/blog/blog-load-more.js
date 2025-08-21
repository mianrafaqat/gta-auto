import { Box, Button } from "@mui/material";

// ----------------------------------------------------------------------

const BlogLoadMore = ({ onLoadMore, disabled = false }) => {
  return (
    <Box sx={{ textAlign: "center", mt: 6 }}>
      <Button
        variant="outlined"
        size="large"
        sx={{ px: 4, py: 1.5 }}
        onClick={onLoadMore}
        disabled={disabled}>
        Load More Posts
      </Button>
    </Box>
  );
};

export default BlogLoadMore;
