import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import Iconify from "src/components/iconify";
import { paths } from "src/routes/paths";

const SubHeader = () => {
  return (
    <Box sx={{ bgcolor: "#000000" }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" py="14px">
          <Typography variant="h7" fontWeight={500} color="#4CAF50">
            Welcome to
          </Typography>

          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="center"
            divider={
              <Box
                component="span"
                sx={{
                  width: "1px",
                  height: 20,
                  bgcolor: "#D9D9D9",
                  mx: 2,
                }}
              />
            }>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: "pointer" }}>
              <Iconify
                icon="eva:pin-fill"
                sx={{ color: "#4CAF50", width: 20, height: 20 }}
              />
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#4CAF50" }}>
                Deliver to{" "}
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Location
                </Box>
              </Typography>
            </Stack>

            {/* Track your order */}
            <Link href={paths.trackOrder} style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}>
                <Iconify
                  icon="eva:car-fill"
                  sx={{ color: "#4CAF50", width: 20, height: 20 }}
                />
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  Track your order
                </Typography>
              </Stack>
            </Link>

            {/* Call A Mechanic */}
            <Link href="tel:+92363330222" style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}>
                <Iconify
                  icon="eva:phone-fill"
                  sx={{ color: "#4CAF50", width: 20, height: 20 }}
                />
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  Call A Mechanic in DHA Lahore
                </Typography>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SubHeader;
