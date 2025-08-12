"use client";

import { Box, Typography, Stack } from "@mui/material";
import React from "react";
import ServiceCard from "./service-card";

const ExpertCar = () => {
  const services = [
    {
      id: 1,
      title: "CERAMIC\nCOATING",
      image: "/assets/car-wash.jpeg", // Fixed path
      onClick: () => console.log("Book Ceramic Coating"),
    },
    {
      id: 2,
      title: "WHEEL\nSCRATCH\nREPAIRS",
      image: "/assets/engine-designer.jpeg", // Fixed path
      onClick: () => console.log("Book Wheel Scratch Repairs"),
    },
    {
      id: 3,
      title: "WHEEL\nSCRATCH\nREPAIRS",
      image: "/assets/interior-shiner.jpeg", // Fixed path
      onClick: () => console.log("Book Wheel Scratch Repairs"),
    },
    {
      id: 4,
      title: "DETAILING",
      image: "/assets/all-cleaser.jpeg", // Fixed path
      onClick: () => console.log("Book Detailing"),
    },
  ];

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Box sx={{ maxWidth: "900px", width: "100%", mb: 6 }}>
        <Typography variant="h1" fontSize="42px !important">
          Expert Car Detailing: From Luxury brands to your everyday ride in
          pakistan
        </Typography>
      </Box>

      {/* Service Cards */}
      <Box sx={{ width: "100%", mx: "auto" }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              image={service.image}
              title={service.title}
              onClick={service.onClick}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ExpertCar;
