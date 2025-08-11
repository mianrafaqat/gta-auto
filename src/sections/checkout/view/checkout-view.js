"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import CheckoutSteps from "../checkout-steps";

// ----------------------------------------------------------------------

export default function CheckoutView() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        pt: 3,
        pb: { xs: 5, md: 8 },
      }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Checkout
      </Typography>

      <CheckoutSteps />
    </Container>
  );
}
