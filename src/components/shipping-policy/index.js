import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  LocalShipping,
  LocationOn,
  Schedule,
  Payment,
  Security,
  CheckCircle,
  Warning,
  Info,
  SupportAgent,
  Phone,
  Email,
  WhatsApp,
  Speed,
  LocalOffer,
  TrackChanges,
} from "@mui/icons-material";

const ShippingPolicy = () => {
  const contactInfo = [
    {
      icon: <Phone color="primary" />,
      label: "Phone",
      value: "+923263333456",
    },
    {
      icon: <Email color="primary" />,
      label: "Email",
      value: "customersupport@gtaAutos.co.uk",
    },
    {
      icon: <WhatsApp color="success" />,
      label: "WhatsApp",
      value: "+923263333456",
    },
  ];

  // Prices and thresholds converted to Pakistani Rupees (₨)
  const shippingMethods = [
    {
      name: "Standard Delivery",
      time: "3-5 Business Days",
      price: "₨1,800",
      features: [
        "Free on orders over ₨18,000",
        "Tracking included",
        "Signature required",
      ],
      icon: <LocalShipping color="primary" />,
    },
    {
      name: "Express Delivery",
      time: "1-2 Business Days",
      price: "₨3,600",
      features: [
        "Priority handling",
        "Real-time tracking",
        "Next day delivery available",
      ],
      icon: <Speed color="success" />,
    },
    {
      name: "Premium Delivery",
      time: "Same Day (Limited Areas)",
      price: "₨7,200",
      features: [
        "Same day delivery",
        "Premium handling",
        "Personal delivery confirmation",
      ],
      icon: <TrackChanges color="warning" />,
    },
  ];

  const deliveryAreas = [
    "United Kingdom (Mainland)",
    "Northern Ireland",
    "Scotland Highlands & Islands",
    "Channel Islands",
    "Isle of Man",
  ];

  const excludedAreas = [
    "Remote Scottish Islands",
    "Some Channel Islands",
    "International destinations (contact us for quotes)",
  ];

  const shippingFeatures = [
    "Free shipping on orders over ₨18,000",
    "Real-time tracking for all orders",
    "Secure packaging to protect your items",
    "Flexible delivery options",
    "Customer support throughout delivery",
  ];

  const deliveryTimeline = [
    {
      step: "Order Placed",
      time: "Immediate",
      description: "Order confirmation sent via email",
      icon: <CheckCircle color="success" />,
    },
    {
      step: "Processing",
      time: "1-2 hours",
      description: "Order verified and prepared for shipping",
      icon: <Info color="info" />,
    },
    {
      step: "Shipped",
      time: "Same day",
      description: "Package picked up by courier",
      icon: <LocalShipping color="primary" />,
    },
    {
      step: "In Transit",
      time: "1-5 days",
      description: "Package on its way to you",
      icon: <TrackChanges color="warning" />,
    },
    {
      step: "Delivered",
      time: "As scheduled",
      description: "Package delivered to your address",
      icon: <CheckCircle color="success" />,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: "50px" }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}>
          Shipping Policy
        </Typography>
        <Typography variant="h6" color="#fff" sx={{ mb: 3 }}>
          Fast, Reliable, and Secure Delivery to Your Doorstep
        </Typography>

        {/* Contact Information Cards */}
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {contactInfo.map((contact, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}>
                {(() => {
                  const label = contact.label.toLowerCase();
                  let href = "#";
                  let target = undefined;
                  if (label.includes("phone")) {
                    // Remove any non-digit/plus characters for tel: link
                    const phone = contact.value.replace(/[^+\d]/g, "");
                    href = `tel:${phone}`;
                  } else if (label.includes("email")) {
                    href = `mailto:${contact.value}`;
                  } else if (label.includes("whatsapp")) {
                    // Remove any non-digit characters for WhatsApp
                    const phone = contact.value.replace(/[^+\d]/g, "");
                    // WhatsApp link format: https://wa.me/<number>
                    // Remove leading "+" for wa.me
                    const waNumber = phone.replace(/^\+/, "");
                    href = `https://wa.me/${waNumber}`;
                    target = "_blank";
                  }
                  return (
                    <a
                      href={href}
                      target={target}
                      rel={
                        target === "_blank" ? "noopener noreferrer" : undefined
                      }
                      style={{ textDecoration: "none" }}>
                      <CardContent sx={{ cursor: "pointer" }}>
                        <Box sx={{ mb: 2 }}>{contact.icon}</Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom>
                          {contact.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ fontWeight: "medium" }}>
                          {contact.value}
                        </Typography>
                      </CardContent>
                    </a>
                  );
                })()}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Policy Introduction */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", color: "primary.main" }}>
                Garage Tuned Autos Auto – Shipping & Delivery Policy
              </Typography>
              <Typography variant="body1" paragraph>
                At Garage Tuned Autos Auto, we understand that fast and reliable
                shipping is crucial to your shopping experience. We partner with
                leading courier services to ensure your orders reach you safely
                and on time.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Delivery times may vary during peak
                  seasons, holidays, or adverse weather conditions. We'll keep
                  you updated with real-time tracking information.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Shipping Methods */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <LocalShipping color="primary" />
                Available Shipping Methods
              </Typography>

              <Grid container spacing={3}>
                {shippingMethods.map((method, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          {method.icon}
                          <Typography
                            variant="h6"
                            sx={{ ml: 1, fontWeight: "bold" }}>
                            {method.name}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h5"
                          color="primary"
                          sx={{ fontWeight: "bold", mb: 1 }}>
                          {method.price}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}>
                          {method.time}
                        </Typography>

                        <List dense>
                          {method.features.map((feature, featureIndex) => (
                            <ListItem key={featureIndex} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <LocationOn color="primary" />
                Delivery Areas
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "success.main" }}>
                    ✅ We Deliver To:
                  </Typography>
                  <List>
                    {deliveryAreas.map((area, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "warning.main" }}>
                    ⚠️ Limited/Excluded Areas:
                  </Typography>
                  <List>
                    {excludedAreas.map((area, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Warning color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Shipping Features */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Security color="primary" />
                Our Shipping Features
              </Typography>

              <Grid container spacing={2}>
                {shippingFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}>
                      <CheckCircle color="success" sx={{ mr: 2 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Delivery Timeline Table */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Schedule color="primary" />
                Delivery Timeline
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Step</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryTimeline.map((step, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}>
                            {step.icon}
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}>
                              {step.step}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={step.time}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Free Shipping Banner */}
          <Card sx={{ mb: 4, backgroundColor: "success.main", color: "white" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <LocalOffer sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Free Shipping
              </Typography>
              <Typography variant="body1">
                On all orders over ₨18,000
              </Typography>
            </CardContent>
          </Card>

          {/* Shipping Tips */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Info color="info" />
                Shipping Tips
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "info.main" }}>
                    📦 Package Protection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All packages are carefully wrapped and protected for safe
                    delivery.
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "info.main" }}>
                    📱 Tracking Updates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive real-time updates via email and SMS throughout the
                    delivery process.
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "info.main" }}>
                    🏠 Delivery Options
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose between home delivery, office delivery, or pickup
                    from local collection points.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card sx={{ backgroundColor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <SupportAgent />
                Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                Our Customer Support Team is available to assist you with any
                shipping questions.
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone fontSize="small" />
                  +923263333456
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" />
                  customersupport@gtaAutos.co.uk
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WhatsApp fontSize="small" />
                  +923263333456
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        textAlign="center"
        mt={6}
        p={3}
        sx={{ backgroundColor: "grey.50", borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}>
          Fast & Reliable Shipping from Garage Tuned Autos! 🚚📦
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We're committed to getting your automotive parts and accessories to
          you quickly and safely.
        </Typography>
      </Box>
    </Container>
  );
};

export default ShippingPolicy;
