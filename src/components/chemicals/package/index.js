'use client';

import { Box, Typography, Stack } from '@mui/material';
import React from 'react';
import PackageCard from './package-card';

const Packages = () => {
  const packages = [
    {
      id: 1,
      title: "OUR WASHES",
      description: "Check out our line of premium washes using the highest level cleaning agent and technology.",
      features: [
        { icon: "eva:clock-outline", text: "Free Vacuums" },
        { icon: "eva:brush-outline", text: "Self-Grab Towels" },
        { icon: "eva:pin-outline", text: "Usable At Any Club Car Wash Location" },
      ],
      isHighlighted: false,
      onClick: () => console.log("View Our Washes"),
    },
    {
      id: 2,
      title: "UNLIMITED CLUB",
      description: "Join the Unlimited Club and wash as often a you'd like. Just two washes per month makes your membership worth it!",
      features: [
        { icon: "eva:checkmark-circle-outline", text: "Wash As Often As You Like" },
        { icon: "eva:clock-outline", text: "Free Vacuums" },
        { icon: "eva:brush-outline", text: "Self-Grab Towels" },
        { icon: "eva:pin-outline", text: "Usable At Any Club Car Wash Location" },
      ],
      isHighlighted: true,
      onClick: () => console.log("View Unlimited Club"),
    },
    {
      id: 3,
      title: "UNLIMITED PERKS",
      description: "Join the Unlimited Club",
      features: [
        { icon: "eva:car-outline", text: "Contactless Express Member Lane" },
        { icon: "eva:checkmark-circle-outline", text: "Wash As Often As You Like" },
        { icon: "eva:clock-outline", text: "Free Vacuums" },
        { icon: "eva:brush-outline", text: "Self-Grab Towels" },
        { icon: "eva:pin-outline", text: "Usable At Any Club Car Wash Location" },
      ],
      isHighlighted: false,
      onClick: () => console.log("View Unlimited Perks"),
    },
  ];

  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: 'transparent' }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              mb: 1
            }}
          >
            2,157 people have said how good Rareblocks
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: "32px", md: "42px" },
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2
            }}
          >
            Chose your Package
          </Typography>
        </Box>

        {/* Package Cards */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              description={pkg.description}
              features={pkg.features}
              isHighlighted={pkg.isHighlighted}
              onClick={pkg.onClick}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Packages;
