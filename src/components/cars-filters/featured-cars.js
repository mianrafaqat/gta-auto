import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import Iconify from "../iconify";
import LatestProductsSection from "./latest-products";
import LastestEightCars from "../first-eight-cars";

export default function FeaturedCarsSection({ allCars }) {
  return (
    // <Container
    //   maxWidth="xl"
    //   sx={{
    //     position: 'relative',
    //     minHeight: '600px',
    //     background: '#000',
    //     py: 8,
    //     px: { xs: 2, sm: 3, md: 4 },
    //   }}
    // >
    //   <Box sx={{ position: 'relative', zIndex: 2 }}>
    //     {/* Header Section */}
    //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
    //       <Typography
    //         variant="h3"
    //         sx={{
    //           color: '#4caf50',
    //           fontWeight: 'bold',
    //           fontSize: { xs: '24px', md: '32px' },
    //         }}
    //       >
    //         Featured Used Cars for Sale
    //       </Typography>

    //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    //         <Typography
    //           variant="body2"
    //           sx={{
    //             color: '#4caf50',
    //             fontWeight: 'bold',
    //             cursor: 'pointer',
    //             '&:hover': {
    //               textDecoration: 'underline',
    //             },
    //           }}
    //         >
    //           View All Used Cars
    //         </Typography>
    //         <IconButton
    //           sx={{
    //             backgroundColor: '#2196f3',
    //             color: 'white',
    //             width: 40,
    //             height: 40,
    //             '&:hover': {
    //               backgroundColor: '#1976d2',
    //             },
    //           }}
    //         >
    //           <Iconify icon="eva:arrow-forward-fill" />
    //         </IconButton>
    //       </Box>
    //     </Box>

    //     {/* Cars Grid */}
    //     <Grid container spacing={3}>
    //       {featuredCars.map((car) => (
    //         <Grid item key={car.id} xs={12} sm={6} md={3}>
    //           <Card
    //             sx={{
    //               backgroundColor: 'white',
    //               borderRadius: '12px',
    //               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    //               overflow: 'hidden',
    //               '&:hover': {
    //                 transform: 'translateY(-4px)',
    //                 boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    //                 transition: 'all 0.3s ease',
    //               },
    //             }}
    //           >
    //             <CardContent sx={{ p: 0 }}>
    //               {/* Top Information */}
    //               <Box sx={{ p: 3, pb: 2 }}>
    //                 <Typography
    //                   variant="caption"
    //                   sx={{
    //                     color: 'text.secondary',
    //                     fontSize: '12px',
    //                     display: 'block',
    //                     mb: 1,
    //                   }}
    //                 >
    //                   {car.brand}
    //                 </Typography>

    //                 <Typography
    //                   variant="h6"
    //                   sx={{
    //                     fontWeight: 'bold',
    //                     fontSize: '16px',
    //                     mb: 2,
    //                     lineHeight: 1.3,
    //                   }}
    //                 >
    //                   {car.model}
    //                 </Typography>

    //                 {/* Specifications Row */}
    //                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                     <Iconify icon="eva:car-fill" sx={{ fontSize: '14px', color: 'text.secondary' }} />
    //                     <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
    //                       {car.mileage}
    //                     </Typography>
    //                   </Box>

    //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                     <Iconify icon="eva:droplet-fill" sx={{ fontSize: '14px', color: 'text.secondary' }} />
    //                     <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
    //                       {car.fuelType}
    //                     </Typography>
    //                   </Box>

    //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                     <Iconify icon="eva:settings-2-fill" sx={{ fontSize: '14px', color: 'text.secondary' }} />
    //                     <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
    //                       {car.engine}
    //                     </Typography>
    //                   </Box>
    //                 </Box>
    //               </Box>

    //               {/* Car Image */}
    //               <Box sx={{ position: 'relative', height: '200px' }}>
    //                 <img
    //                   src={car.image}
    //                   alt={car.model}
    //                   style={{
    //                     width: '100%',
    //                     height: '100%',
    //                     objectFit: 'cover',
    //                   }}
    //                 />

    //                 {/* Watermark */}
    //                 <Typography
    //                   variant="caption"
    //                   sx={{
    //                     position: 'absolute',
    //                     bottom: 8,
    //                     left: 8,
    //                     color: 'rgba(255, 255, 255, 0.7)',
    //                     fontSize: '10px',
    //                     fontWeight: 'bold',
    //                   }}
    //                 >
    //                   garage tuned autos
    //                 </Typography>

    //                 {/* Action Buttons */}
    //                 <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
    //                   <IconButton
    //                     size="small"
    //                     sx={{
    //                       backgroundColor: 'rgba(0, 0, 0, 0.7)',
    //                       color: 'white',
    //                       width: 28,
    //                       height: 28,
    //                       '&:hover': {
    //                         backgroundColor: 'rgba(0, 0, 0, 0.9)',
    //                       },
    //                     }}
    //                   >
    //                     <Iconify icon="eva:close-fill" sx={{ fontSize: '12px' }} />
    //                   </IconButton>

    //                   <IconButton
    //                     size="small"
    //                     sx={{
    //                       backgroundColor: 'rgba(0, 0, 0, 0.7)',
    //                       color: 'white',
    //                       width: 28,
    //                       height: 28,
    //                       '&:hover': {
    //                         backgroundColor: 'rgba(0, 0, 0, 0.9)',
    //                       },
    //                     }}
    //                   >
    //                     <Iconify icon="eva:heart-fill" sx={{ fontSize: '12px' }} />
    //                   </IconButton>
    //                 </Box>
    //               </Box>

    //               {/* Bottom Information */}
    //               <Box sx={{ p: 3, pt: 2 }}>
    //                 <Typography
    //                   variant="h6"
    //                   sx={{
    //                     color: '#4caf50',
    //                     fontWeight: 'bold',
    //                     fontSize: '18px',
    //                     mb: 1,
    //                   }}
    //                 >
    //                   {car.price}
    //                 </Typography>

    //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                   <Iconify icon="eva:pin-fill" sx={{ fontSize: '14px', color: '#4caf50' }} />
    //                   <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
    //                     {car.location}
    //                   </Typography>
    //                 </Box>
    //               </Box>
    //             </CardContent>
    //           </Card>
    //         </Grid>
    //       ))}
    //     </Grid>
    //   </Box>
    // </Container>
    <LastestEightCars allCars={allCars} />
  );
}
