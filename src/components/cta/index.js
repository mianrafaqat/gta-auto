import { Box, Container, Typography, Button } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import React from "react";

const CTA = () => {
  return (
    <Container maxWidth="xl" sx={{ mb: 5 }}>
      <Box
        sx={{
          mt: 10,
          p: { xs: 2, md: 6 },
          backgroundColor: "rgba(0, 255, 136, 0.1)",
          border: "1px solid #4caf50",
          borderRadius: 4,
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#00ff88",
            mb: 3,
          }}>
          Ready to Get Started?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: "#ffffff",
            opacity: 0.9,
            maxWidth: 600,
            mx: "auto",
          }}>
          Contact us now for a free consultation and quote. Our team is ready to
          help you!
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<WhatsApp />}
          onClick={() => handleWhatsAppClick("services")}
          sx={{
            backgroundColor: "#00ff88",
            color: "#000000",
            px: 3,
            py: 2,
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "2px",
            borderRadius: "14px",
            "&:hover": {
              backgroundColor: "#4caf50",
            },
            transition: "all 0.3s ease",
          }}>
          Contact Us on WhatsApp
        </Button>
      </Box>
    </Container>
  );
};

export default CTA;
