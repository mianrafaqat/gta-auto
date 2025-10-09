import { Box, Container, Typography } from '@mui/material'
import React from 'react'

const WhoWeAre = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#000' }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            border: '2px solid #25D366',
            borderRadius: 4,
            p: 6,
            bgcolor: 'rgba(37, 211, 102, 0.05)',
            color: '#fff'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#25D366', 
              fontWeight: 700, 
              mb: 4,
              textAlign: 'center'
            }}
          >
            Who We Are
          </Typography>
          
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: '#e0e0e0' }}>
            Welcome to <strong style={{ color: '#25D366' }}>Garage Tuned Autos</strong> — your all-in-one destination for premium automotive care, performance, and passion.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            At Garage Tuned Autos, we specialize in professional car tuning, detailing, repairs, and maintenance services, helping every vehicle reach its peak performance and appearance. From engine tuning and diagnostics to ceramic coating, detailing, and custom modifications, our expert technicians bring precision, experience, and innovation to every job.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            We're also proud to offer a wide range of high-quality automotive chemicals and care products, including engine oils, detailing supplies, and performance additives — trusted by professionals and car lovers alike for reliability and results.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: '#e0e0e0' }}>
            But that's not all — we go beyond the workshop! Explore our Car Listings section to buy or sell vehicles with confidence, and check out our Car Rental Service to experience top-tier cars for daily drives, business needs, or special occasions.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2, color: '#e0e0e0' }}>
            At Garage Tuned Autos, we don't just maintain cars — we build trust, performance, and a community of passionate drivers.
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              color: '#25D366', 
              fontWeight: 700,
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            Garage Tuned Autos — Tuned for Performance, Built for You.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default WhoWeAre