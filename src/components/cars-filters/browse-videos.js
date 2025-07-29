import React from 'react';
import { Box, Typography, Grid, Container, Card, CardContent, IconButton } from '@mui/material';
import Iconify from '../iconify';

const videos = [
  {
    id: 1,
    title: "Is the Toyota Raize Worth It? Owner Breaks It Down!",
    thumbnail: "/assets/video-thumbnails/toyota-raize.jpg",
    isLarge: true,
  },
  {
    id: 2,
    title: "The Devastation You Can't Ignor...",
    thumbnail: "/assets/video-thumbnails/flash-floods.jpg",
    isLarge: false,
  },
  {
    id: 3,
    title: "Beamer 340 ki Most Abused BM...",
    thumbnail: "/assets/video-thumbnails/bmw-abused.jpg",
    isLarge: false,
  },
  {
    id: 4,
    title: "MG Cyberster, Porsche Sey Tez ...",
    thumbnail: "/assets/video-thumbnails/porsche-taycan.jpg",
    isLarge: false,
  },
  {
    id: 5,
    title: "We Test Drove the New Honda ...",
    thumbnail: "/assets/video-thumbnails/honda-hrv.jpg",
    isLarge: false,
  },
];

export default function BrowseVideosSection() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
      
        minHeight: '600px',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography
            variant="h3"
            sx={{
              color: '#4caf50',
              fontWeight: 'bold',
              fontSize: { xs: '24px', md: '32px' },
            }}
          >
            Browse Our Videos
          </Typography>
          
          <Typography
            component="a"
            href="/videos"
            sx={{
              color: '#4caf50',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View All Videos
          </Typography>
        </Box>

        {/* Videos Grid */}
        <Grid container spacing={3}>
          {/* Large Video - Left Column */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '400px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Play Button Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    },
                  }}
                >
                  <Iconify 
                    icon="eva:play-fill" 
                    sx={{ 
                      color: '#ffffff', 
                      fontSize: '32px',
                      ml: 0.5 
                    }} 
                  />
                </Box>
                
                {/* Placeholder Content */}
                <Box
                  sx={{
                    width: '120px',
                    height: '80px',
                    backgroundColor: '#666666',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify 
                    icon="eva:play-circle-fill" 
                    sx={{ 
                      color: '#ffffff', 
                      fontSize: '40px' 
                    }} 
                  />
                </Box>
              </Box>
              
              {/* Video Title */}
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    lineHeight: 1.3,
                  }}
                >
                  {videos[0].title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Smaller Videos - Right Column */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {videos.slice(1).map((video) => (
                <Grid item xs={6} key={video.id}>
                  <Card
                    sx={{
                      height: '190px',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: '140px',
                        background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Play Button Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '50px',
                          height: '50px',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            transform: 'translate(-50%, -50%) scale(1.1)',
                          },
                        }}
                      >
                        <Iconify 
                          icon="eva:play-fill" 
                          sx={{ 
                            color: '#ffffff', 
                            fontSize: '20px',
                            ml: 0.5 
                          }} 
                        />
                      </Box>
                      
                      {/* Placeholder Content */}
                      <Box
                        sx={{
                          width: '60px',
                          height: '40px',
                          backgroundColor: '#666666',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify 
                          icon="eva:play-circle-fill" 
                          sx={{ 
                            color: '#ffffff', 
                            fontSize: '24px' 
                          }} 
                        />
                      </Box>
                    </Box>
                    
                    {/* Video Title */}
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#333333',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {video.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 