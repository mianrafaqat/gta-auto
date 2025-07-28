import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const carBrands = [
  {
    name: 'BMW',
    logo: '/assets/bmw.png',
  },
  {
    name: 'MERCEDES-BENZ',
    logo: '/assets/mercedes.png',
  },
  {
    name: 'TOYOTA',
    logo: '/assets/toyota-logo.png',
  },
  {
    name: 'KIA',
    logo: '/assets/kia_PNG46.png',
  },
  {
    name: 'HONDA',
    logo: '/assets/honda-logo.png',
  },
  {
    name: 'MG',
    logo: '/assets/mg.png',
  },
];

export default function BrowseBrandsSection() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#000',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        {/* Top Makes */}
        <Typography
          variant="body2"
          sx={{
            color: '#ccc',
            fontSize: '12px',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '500',
          }}
        >
          TOP MAKES
        </Typography>
        
        {/* Browse By Brands */}
        <Typography
          variant="h3"
          sx={{
            color: '#4caf50',
            fontWeight: 'bold',
            fontSize: { xs: '28px', md: '36px' },
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Browse By Brands
        </Typography>
      </Box>

      {/* Brand Logos Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'wrap',
          maxWidth: '100%',
        }}
      >
        {carBrands.map((brand) => (
          <Box
            key={brand.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '180px',
            }}
          >
            {/* Logo Container */}
            <Box
              sx={{
                width: '180px',
                height: '100px',
                border: '1px solid #fff',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0,
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#fff',
                  border: '1px solid #fff',
                },
              }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                style={{
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            {/* Brand Name */}
            <Box
              sx={{
                width: '180px',
                backgroundColor: '#fff',
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fff',
                borderTop: 'none',
                borderRadius: '0',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {brand.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
} 