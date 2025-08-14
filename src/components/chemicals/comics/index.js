import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

const Comics = () => {
  return (
    <Stack
      direction="row"
      gap="32px"
      flexWrap={{ md: "nowrap", xs: "wrap" }}
      sx={{
        my: "42px",
      }}>
      <Box sx={{ width: { md: "50%", xs: "100%" } }}>
        <img src="/assets/chomic_bg.jpeg" />
      </Box>

      <Box
        position="relative"
        zIndex={99}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { md: "50%", xs: "100%" },
          flexDirection: "column",
          gap: "16px",
        }}>
        <Typography variant="h2" sx={{ color: "#4caf50", textAlign: "center" }}>
          GTA COMICS
        </Typography>
        <Typography color="#fff" textAlign="center">
          Dive into the world of GTA Comics! Explore a fun and imaginative
          collection of stories, adventures, and characters brought to life by
          our creative team. Whether you love action, humor, or just a good
          story, our comics have something for everyone. Stay tuned for new
          issues and exciting updates!
        </Typography>
        <Button variant="contained" color="primary">
          View Here
        </Button>
      </Box>
    </Stack>
  );
};

export default Comics;
