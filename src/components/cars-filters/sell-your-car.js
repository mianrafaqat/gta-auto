import React from 'react';
import { Box, Typography, Grid, Button, Container, Stack } from '@mui/material';
import Iconify from '../iconify';
import { useRouter } from 'next/navigation';

const benefits = [
  {
    left: [
      "Post an ad in 2 minutes",
      "20 million users",
      "Connect directly with buyers"
    ],
    right: [
      "Sell your car without hassle",
      "Free Inspection & Featured ad",
      "Maximize offer with sales agent"
    ]
  }
];

export default function SellYourCarSection() {
  const router = useRouter();
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'black',
        minHeight: '400px',
        mt: "32px",
      }}
    >
      <Box
        sx={{
          backgroundColor: '#000000',
          border: '2px solid #4caf50',
          borderRadius: '8px',
          p: { xs: 4, md: 6 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            fontSize: { xs: '24px', md: '32px' },
          }}
        >
          Sell Your Car on GarageTunedAutos and Get the Best Price
        </Typography>

        {/* Benefits Section */}
        <Grid container gap="32px" flexWrap={{md: "nowrap", xs: "wrap"}} justifyContent="center" sx={{ mb: 6 }}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {benefits[0].left.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Iconify 
                    icon="mdi:check-circle" 
                    sx={{ 
                      color: '#4caf50', 
                      fontSize: { xs: '20px', md: '24px' } 
                    }} 
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#ffffff',
                      fontSize: { xs: '14px', md: '16px' },
                      fontWeight: 'medium',
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {benefits[0].right.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Iconify 
                    icon="mdi:check-circle" 
                    sx={{ 
                      color: '#4caf50', 
                      fontSize: { xs: '20px', md: '24px' } 
                    }} 
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#ffffff',
                      fontSize: { xs: '14px', md: '16px' },
                      fontWeight: 'medium',
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Call-to-Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4caf50',
              color: '#ffffff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '6px',
              fontSize: { xs: '14px', md: '16px' },
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
            onClick={() => router.push('/login')}
          >
            Post Your Ad
          </Button>
          
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#bdbdbd',
              color: '#ffffff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '6px',
              fontSize: { xs: '14px', md: '16px' },
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#a0a0a0',
              },
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 