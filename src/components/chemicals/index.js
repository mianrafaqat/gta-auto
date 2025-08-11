"use client";
import { Box } from "@mui/material";
import React from "react";
import ExpertCar from "./expert-car";
import Washing from "./washing";
import Packages from "./package";
import HeroBanner from "./HeroBanner";

const Chemicals = () => {
  return (
    <Box>
      <HeroBanner />
      <ExpertCar />
      <Washing />
      <Packages />
    </Box>
  );
};

export default Chemicals;
