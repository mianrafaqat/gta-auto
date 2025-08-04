'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const PackageCard = ({ title, description, features, isHighlighted = false, onClick }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '350px',
        p: 4,
        borderRadius: '16px',
        backgroundColor: isHighlighted ? '#4caf50' : 'transparent',
        border: isHighlighted ? '2px solid #4caf50' : '1px solid rgba(255,255,255,0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        },
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          mb: 2,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.8)',
          mb: 3,
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {description}
      </Typography>

      {/* Features List */}
      <Stack spacing={2} sx={{ mb: 4, flex: 1 }}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Iconify 
                icon={feature.icon} 
                sx={{ fontSize: '16px' }} 
              />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500
              }}
            >
              {feature.text}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Button */}
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          backgroundColor: '#ff6b35',
          color: '#fff',
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          py: 1.5,
          width: "max-content",
          mx: "auto",
          '&:hover': {
            backgroundColor: '#e55a2b',
          },
        }}
      >
        View Washes
      </Button>
    </Box>
  );
};

export default PackageCard; 