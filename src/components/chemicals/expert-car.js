'use client';

import { Box, Typography, Stack } from "@mui/material";
import React from "react";
import ServiceCard from "./service-card";

const ExpertCar = () => {
  const services = [
    {
      id: 1,
      title: "CERAMIC\nCOATING",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop&crop=center",
      onClick: () => console.log("Book Ceramic Coating"),
    },
    {
      id: 2,
      title: "WHEEL\nSCRATCH\nREPAIRS",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=600&fit=crop&crop=center",
      onClick: () => console.log("Book Wheel Scratch Repairs"),
    },
    {
      id: 3,
      title: "WHEEL\nSCRATCH\nREPAIRS",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop&crop=center",
      onClick: () => console.log("Book Wheel Scratch Repairs"),
    },
    {
      id: 4,
      title: "DETAILING",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=600&fit=crop&crop=center",
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
          }}
        >
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
