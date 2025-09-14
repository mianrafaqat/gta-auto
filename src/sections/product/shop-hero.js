import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import React from "react";

const ShopHero = () => {
  return (
    <Box
      sx={{
        background: "#E2D0C0",
        width: "100%",
        // mt: "50px",
      }}>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          gap={3}
          alignItems="flex-start"
          justifyContent={{ xs: "center", md: "space-between" }}
          width="100%"
          flexWrap={{ xs: "wrap", md: "nowrap" }}>
          {/* Left Section - Text Content */}

          <Box sx={{ textAlign: { xs: "center", md: "left" }, mt: "37px" }}>
            <Typography
              variant="body1"
              sx={{
                color: "#212121",
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 400,
                mb: 1,
              }}>
              For the First time in Pakistan
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: "#212121",
                fontSize: { xs: "28px", sm: "36px", md: "48px" },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 1,
              }}>
              Premier Destination for Car Accessories
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: "#212121",
                fontSize: { xs: "28px", sm: "36px", md: "48px" },
                fontWeight: 700,
                lineHeight: 1.1,
              }}>
              in Pakistan
            </Typography>
          </Box>

          {/* Right Section - 3D Graphic */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
              }}>
              <Box
                component="img"
                src="/assets/shopHeroCard.png"
                alt="Import Dream Car"
                sx={{
                  width: { xs: "280px", sm: "320px", md: "400px" },
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </Box>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default ShopHero;
