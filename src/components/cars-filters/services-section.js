import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Container } from '@mui/material';

const services = [
  {
    id: 1,
    title: 'Call a Mechanics',
    description: 'Description Here..Car Broke Down? Call a GTA Mechanic - Fast, Reliable & Responsible! Garage Tuned Auto\'s Call a Mechanic service is your roadside Ustad Ji!',
    icon: '/assets/callMechenic.webp',
    gridSize: { xs: 12, md: 4 },
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  {
    id: 2,
    title: 'Towing Service',
    description: 'Totaled/Dead Car or Need a Tow Truck Quickly? Garage Tuned Autos has got your back - Quick & Hassle-Free!',
    icon: '/assets/towing.webp',
    gridSize: { xs: 12, md: 4 },
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  {
    id: 3,
    title: 'Car Detailing',
    description: 'Make Your Ride Look FRESH! - GTA\'s Premium Detailing & PPF Service in Lahore, Islamabad & Rawalpindi.',
    icon: '/assets/carDetailing.webp',
    gridSize: { xs: 12, md: 4 },
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
];

export default function ServicesSection() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        position: 'relative',
        height: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/serviceBg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main Heading */}
        <Typography
          variant="h3"
          sx={{
            color: '#4caf50',
            fontWeight: 'bold',
            fontSize: { xs: '28px', md: '36px' },
            mb: 6,
            textAlign: 'left',
          }}
        >
          Services We Offer
        </Typography>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item key={service.id} {...service.gridSize}>
              <Card
                sx={{
                  backgroundColor: service.backgroundColor,
                  border: '1px solid #F1F1F1',
                  borderRadius: '8px',
                  height: '100%',
                  boxShadow: service.backgroundColor === 'transparent' 
                    ? "0px 0px 0px 0px rgba(0,0,0,0.5)"
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: service.alignItems 
                  }}>
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: service.justifyContent,
                      }}
                    >
                      <img
                        src={service.icon}
                        alt={service.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: 1.6,
                        fontSize: '14px',
                        textAlign: 'left',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 