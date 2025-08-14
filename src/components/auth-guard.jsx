'use client';

import { useEffect, useState } from 'react';
import { ACCESS_TOKEN_KEY } from 'src/utils/constants';
import { Box, Alert, Button, Container } from '@mui/material';
import { paths } from 'src/routes/paths';

export default function AuthGuard({ children, fallback }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return null;
  }

  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please log in to access this page
          </Alert>
          <Button
            variant="contained"
            href={paths.auth.jwt.login}
            fullWidth
          >
            Log In
          </Button>
        </Box>
      </Container>
    );
  }

  return children;
}
