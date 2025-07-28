import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, IconButton, Container } from '@mui/material';
import Iconify from '../iconify';

const latestProducts = [
  {
    id: 1,
    name: 'Jeelo Flavour Gray Premium',
    category: 'Uncategorized',
    price: 'Rs850.00',
    image: '/assets/jeelo.webp', // Placeholder - replace with actual product image
  },
  {
    id: 2,
    name: 'Car Washing Spong',
    category: 'Car Care',
    price: 'Rs1,000.00',
    image: '/assets/spong.webp', // Placeholder - replace with actual product image
  },
  {
    id: 3,
    name: '5D Matt, Corolla Alto City, cultus...',
    category: 'Car Interior Accessories, Interior',
    price: 'Rs3,000.00',
    image: '/assets/mat.webp', // Placeholder - replace with actual product image
  },
  {
    id: 4,
    name: 'Double Sllencer Cover',
    category: 'Uncategorized',
    price: 'Rs1,500.00',
    image: '/assets/silencer.webp', // Placeholder - replace with actual product image
  },
];

export default function LatestProductsSection() {
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
        {/* Section Title */}
        <Typography
          variant="h3"
          sx={{
            color: '#4caf50',
            fontWeight: 'bold',
            fontSize: { xs: '24px', md: '32px' },
            mb: 6,
            textTransform: 'uppercase',
          }}
        >
          Latest Products
        </Typography>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {latestProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  border: '1px solid #4caf50',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(76, 175, 80, 0.3)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {/* Product Image Area */}
                <Box
                  sx={{
                    position: 'relative',
                    // height: '200px',
                    padding: "24px",
                    backgroundColor: 'transparent',
                    backgroundImage: 'url("/assets/garage-tuned-autos-pattern.png")', // Watermark pattern
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  
                </Box>

                {/* Product Details */}
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
                  {/* Category */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ffffff',
                      fontSize: '11px',
                      mb: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.category}
                  </Typography>

                  {/* Product Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      mb: 1,
                      lineHeight: 1.3,
                      color: '#ffffff',
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Price */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      mb: 3,
                    }}
                  >
                    {product.price}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#666666',
                        textTransform: 'none',
                        fontSize: '12px',
                        px: 2,
                        py: 1,
                        borderRadius: '4px',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          color: '#666666',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Add To Cart
                    </Button>
                    <IconButton
                      size="small"
                      sx={{
                        border: '1px solid #ffffff',
                        backgroundColor: 'transparent',
                        color: '#666666',
                        width: 32,
                        height: 32,
                        borderRadius: '4px',
                        '&:hover': {
                          border: '1px solid #ffffff',
                          color: '#666666',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <Iconify icon="eva:external-link-fill" sx={{ fontSize: '14px' }} />
                    </IconButton>
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