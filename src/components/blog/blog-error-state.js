import { Alert, Container } from "@mui/material";

// ----------------------------------------------------------------------

const BlogErrorState = ({ error }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    </Container>
  );
};

export default BlogErrorState;
