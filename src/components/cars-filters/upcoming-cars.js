import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Container } from '@mui/material';

const upcomingCars = [
  {
    id: 1,
    title: '2021 Hyundai Santa Fe Is Launched In Indonesia',
    category: 'INTERNATIONAL',
    description: 'The fourth generation Hyundai Santa Fe that was unveiled...',
    image: '/assets/hyundai.webp',
  },
  {
    id: 2,
    title: 'KIA Cerato Facelift Unveiled in South Korea',
    category: 'INTERNATIONAL',
    description: 'The much awaited KIA Cerato facelift has been officially...',
    image: '/assets/KiaCerato.webp',
  },
  {
    id: 3,
    title: 'Fresh Batch of Toyota Corolla Cross Reaches',
    category: 'INTERNATIONAL',
    description: 'A premium fresh batch of Toyota Corolla Cross itself...',
    image: '/assets/ToyotaCorolla.webp',
  },
  {
    id: 4,
    title: 'Car Sales Surge Record High by 44% in January',
    category: 'DRIVE TIPS',
    description: 'A Gathered hath that days all don\'t one kind...',
    image: '/assets/surgeRecord.webp',
  },
];

export default function UpcomingCarsSection() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'black',
        minHeight: '600px',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Subtitle */}
        <Typography
          variant="caption"
          sx={{
            color: '#ffffff',
            fontSize: '12px',
            textTransform: 'uppercase',
            textAlign: 'center',
            display: 'block',
            mb: 1,
          }}
        >
          LATEST PUBLISHED
        </Typography>

        {/* Section Title */}
        <Typography
          variant="h3"
          sx={{
            color: '#4caf50',
            fontWeight: 'bold',
            fontSize: { xs: '24px', md: '32px' },
            mb: 6,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Upcoming Cars And Events
        </Typography>

        {/* Cars Grid */}
        <Grid container spacing={3}>
          {upcomingCars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {/* Car Image */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '200px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={car.image}
                    alt={car.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Content Area with White Background */}
                <CardContent 
                  sx={{ 
                    p: 3, 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {/* Category */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#4caf50',
                      fontSize: '11px',
                      mb: 1,
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}
                  >
                    {car.category}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      mb: 2,
                      lineHeight: 1.3,
                      color: '#000000',
                    }}
                  >
                    {car.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000000',
                      fontSize: '12px',
                      mb: 3,
                      lineHeight: 1.4,
                    }}
                  >
                    {car.description}
                  </Typography>

                  {/* Read More Link */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000000',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#4caf50',
                      },
                    }}
                  >
                    Read More..
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 