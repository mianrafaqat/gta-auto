"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import {
  WhatsApp,
  Build,
  DirectionsCar,
  LocalCarWash,
  Support,
} from "@mui/icons-material";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Call a Mechanics",
      description:
        "Professional mobile mechanics available 24/7. We come to your location with all necessary tools and equipment to diagnose and fix your vehicle issues on the spot. No need to tow your vehicle - we bring the workshop to you.",
      image: "/assets/Call-a-mechanic.png",
      icon: <Build sx={{ fontSize: 30, color: "#4caf50" }} />,
      features: [
        "24/7 Emergency Service",
        "Mobile Workshop",
        "Professional Mechanics",
        "On-site Diagnostics",
        "Quality Guarantee",
        "No Towing Required",
      ],
      responseTime: "15-30 minutes",
    },
    {
      id: 2,
      title: "Towing Service",
      description:
        "Reliable towing service for all types of vehicles. Whether you're stranded on the road or need vehicle transport, our professional team is ready to help. We handle everything from small cars to large trucks.",
      image: "/assets/towing-service.png",
      icon: <DirectionsCar sx={{ fontSize: 30, color: "#4caf50" }} />,
      features: [
        "24/7 Emergency Towing",
        "All Vehicle Types",
        "GPS Tracking",
        "Insurance Coverage",
        "Professional Drivers",
        "Quick Response Time",
      ],
      responseTime: "20-45 minutes",
    },
    {
      id: 3,
      title: "Car Studio",
      description:
        "Premium car detailing and studio services. From basic wash to complete detailing, ceramic coating, and paint protection - we make your car look brand new. Professional care for your vehicle's appearance.",
      image: "/assets/car-studio.png",
      icon: <LocalCarWash sx={{ fontSize: 30, color: "#4caf50" }} />,
      features: [
        "Premium Detailing",
        "Ceramic Coating",
        "Paint Protection",
        "Interior Deep Clean",
        "Express Services",
        "Professional Finish",
      ],
      responseTime: "Same Day",
    },
  ];

  const handleWhatsAppClick = (serviceName) => {
    const message = `Hi! I'm interested in your ${serviceName} service. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/92363330222?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: "#000000",
        minHeight: "100vh",
      }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "#4caf50",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}>
            Our Premium Services
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: "auto",
              mb: 6,
              color: "#ffffff",
              opacity: 0.9,
              lineHeight: 1.6,
            }}>
            Professional automotive services delivered with excellence. We're
            here to keep your vehicle running smoothly and looking great.
          </Typography>

          {/* Contact Info Banner */}
          {/* <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: "rgba(0, 255, 136, 0.1)",
              border: "2px solid #00ff88",
              borderRadius: 3,
              maxWidth: 500,
              mx: "auto",
              backdropFilter: "blur(10px)",
            }}>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              justifyContent="center">
              <Support sx={{ fontSize: 40, color: "#00ff88" }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#00ff88" }}>
                  Need Help?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#ffffff", opacity: 0.8 }}>
                  Contact us anytime for assistance
                </Typography>
              </Box>
            </Stack>
          </Paper> */}
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} md={4} key={service.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.4s ease",
                  backgroundColor: "transparent",
                  border: "1px solid #4caf50",
                }}>
                {/* Service Image */}
                <CardMedia
                  component="img"
                  height="250"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    position: "relative",
                  }}
                />

                {/* Service Icon Overlay */}
                {/* <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "transparent",
                    borderRadius: "50%",
                    p: 2,
                    // backdropFilter: "blur(10px)",
                    border: "1px solid #4caf50",
                  }}>
                  {service.icon}
                </Box> */}

                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h4"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        color: "#4caf50",
                        mb: 2,
                      }}>
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        lineHeight: 1.7,
                        color: "#ffffff",
                        opacity: 0.9,
                        fontSize: "1.1rem",
                      }}>
                      {service.description}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: "#4caf50",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}>
                      What's Included:
                    </Typography>
                    <Stack spacing={2}>
                      {service.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#4caf50",
                              boxShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#ffffff",
                              opacity: 0.9,
                              fontWeight: 500,
                            }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WhatsApp />}
                    onClick={() => handleWhatsAppClick(service.title)}
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      py: 2,
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      textTransform: "uppercase",

                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#4caf50",
                      },
                    }}>
                    Contact on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA Section */}
        <Box
          sx={{
            mt: 10,
            p: 6,
            backgroundColor: "rgba(0, 255, 136, 0.1)",
            border: "1px solid #4caf50",
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#00ff88",
              mb: 3,
            }}>
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: "#ffffff",
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
            }}>
            Contact us now for a free consultation and quote. Our team is ready
            to help you!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<WhatsApp />}
            onClick={() => handleWhatsAppClick("services")}
            sx={{
              backgroundColor: "#00ff88",
              color: "#000000",
              px: 3,
              py: 2,
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "2px",
              borderRadius: "14px",
              "&:hover": {
                backgroundColor: "#4caf50",
              },
              transition: "all 0.3s ease",
            }}>
            Contact Us on WhatsApp
          </Button>
        </Box>
      </Container>

      {/* CSS Animation for pulse effect */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </Box>
  );
};

export default Services;
