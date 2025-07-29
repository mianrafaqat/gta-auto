import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';

const carBodyTypes = [
  {
    name: 'Coupe',
    image: '/assets/coupe.png',
  },
  {
    name: 'Crossover',
    image: '/assets/crossover-1.png',
  },
  {
    name: 'Truck',
    image: '/assets/truck-1.png',
  },
  {
    name: 'Wagon',
    image: '/assets/wan.png',
  },
  {
    name: 'Sedan',
    image: '/assets/sedan-1.png',
  },
  {
    name: 'Hybrid',
    image: '/assets/convertable.png',
  },
];

export default function CarBodyTypesSection() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        zIndex: -999,
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#fff',
        minHeight: '400px',
      }}
    >
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#333',
              fontWeight: 'bold',
              fontSize: '28px',
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            LOOKING MORE!
          </Typography>
          
          <Button
           
            sx={{
              // border: '2px solid #4caf50',
              color: '#4caf50',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                // border: '2px solid #45a049',
                // color: '#45a049',
                // backgroundColor: 'transparent',
                bgcolor: "transparent"
              },
            }}
          >
            Explore By Body Type
          </Button>
        </Box>

        {/* Car Body Types Grid */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {carBodyTypes.map((car) => (
            <Box
              key={car.name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '1 1 auto',
                minWidth: '150px',
                maxWidth: '180px',
              }}
            >
              {/* Car Image */}
              <Box

sx={{
                  width: '200px',
                  height: '150px',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    '& + .MuiTypography-root': {
                      color: '#4caf50'
                    }
                  }
                }}
              >
                <img
                  src={car.image}
                  alt={car.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              {/* Car Type Label */}
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {car.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
} 