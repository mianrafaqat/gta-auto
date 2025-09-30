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
  Paper,
  Alert,
} from "@mui/material";
import {
  Phone,
  Email,
  WhatsApp,
  CheckCircle,
  Cancel,
  Warning,
  LocalShipping,
  Payment,
  Schedule,
  Support,
  Security,
  Info,
} from "@mui/icons-material";

const RefundAndCancelation = () => {
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

  const validReasons = [
    "Damaged or Defective Product: Received item is broken, destroyed, or not functioning.",
    "Incomplete Product: Missing items or accessories.",
    "Wrong Product Delivered: Includes wrong size, color, model, fake item, or expired product.",
    "Mismatch with Description: Product does not match the listed specifications, description, or pictures.",
  ];

  const nonReturnableItems = [
    "All types of vehicles (e.g., Bikes, Electric Bikes, Batteries, Tyres, Cars)",
    "Installation or Fitting services, PPF",
  ];

  const packingGuidelines = [
    "Use original and undamaged packaging",
    "Ensure the product is unused, with all tags, seals, manuals, and accessories intact",
    "Attach the return shipping label clearly",
    "Do not apply tape, stickers, or labels directly on the product box",
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
          Returns & Refunds
        </Typography>
        <Typography variant="h6" color="#fff" sx={{ mb: 3 }}>
          Need Help? Our Customer Support Team is Here for You
        </Typography>

        {/* Contact Information Cards */}
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {contactInfo.map((contact, index) => (
            <Grid item xs={12} sm={4} key={index}>
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
                    <Card
                      sx={{
                        height: "100%",
                        textAlign: "center",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                        "&:hover": { transform: "translateY(-4px)" },
                      }}>
                      <CardContent>
                        <Box sx={{ mb: 2 }}>{contact.icon}</Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom>
                          {contact.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}>
                          {contact.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </a>
                );
              })()}
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
                Garage Tuned Autos – Returns & Refunds Policy
              </Typography>
              <Typography variant="body1" paragraph>
                At Garage Tuned Autos Auto , customer satisfaction is our top
                priority. To ensure a smooth and transparent return experience,
                please review the following updated policy:
              </Typography>
            </CardContent>
          </Card>

          {/* Valid Reasons for Return */}
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
                <CheckCircle color="success" />
                Valid Reasons for Return
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Returns are accepted only under the following conditions:
              </Typography>
              <List>
                {validReasons.map((reason, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={reason} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Automotive & Motorcycle Accessories */}
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
                <Warning color="warning" />
                Automotive & Motorcycle Accessories and Other Specific Items
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  Change of Mind Not Accepted: Returns/refunds are not
                  applicable in case of change of mind for automotive or
                  motorcycle accessories.
                </Typography>
              </Alert>
              <Typography variant="body2">
                Refund Eligibility: Only damaged, defective, incorrect, or
                incomplete products are eligible for refund — assessed based on
                shared photo/video evidence required by our Customer Support
                Team.
              </Typography>
            </CardContent>
          </Card>

          {/* Non-Returnable Items */}
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
                <Cancel color="error" />
                Non-Returnable Items
              </Typography>
              <List>
                {nonReturnableItems.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Cancel color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* How to Pack Your Return */}
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
                How to Pack Your Return
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                To avoid rejection of your return, please follow these
                guidelines:
              </Typography>
              <List>
                {packingGuidelines.map((guideline, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Info color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={guideline} />
                  </ListItem>
                ))}
              </List>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Note: Returns sent in poor condition or missing components may
                  be rejected and sent back without refund.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Timeline and Process */}
        <Grid item xs={12} lg={4}>
          {/* Return Process Timeline */}
          <Card sx={{ mb: 4, position: "relative", top: 20 }}>
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
                Return Process
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Chip
                    label="3 Business Days"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Initiate return within 3 business days (72 hours) from
                    receiving of your order.
                  </Typography>
                </Box>

                <Box>
                  <Chip
                    label="Documentation Required"
                    color="secondary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Share and attach clear photo and/or video evidence when
                    submitting your return request.
                  </Typography>
                </Box>

                <Box>
                  <Chip
                    label="Return Shipping"
                    color="info"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    The customer is responsible for return shipping costs unless
                    the issue is verified by our Quality Evaluation Team.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Refund & Replacement Timeline */}
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
                <Payment color="success" />
                Refund & Replacement Timeline
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "success.main" }}>
                    Replacement Dispatch
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Within 5 to 10 working days (location and product-dependent)
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "success.main" }}>
                    Refund Processing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Within 7 to 10 working days, after approval, via bank
                    deposit
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
                <Support />
                Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                Our Customer Support Team is available to assist you with any
                questions about returns and refunds.
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  component="a"
                  href="tel:+923263333456">
                  <Phone fontSize="small" />
                  +923263333456
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  component="a"
                  href="mailto:support@garagetunedautos.com">
                  <Email fontSize="small" />
                  support@garagetunedautos.com
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  component="a"
                  href="https://wa.me/923263333456"
                  target="_blank"
                  rel="noopener noreferrer">
                  <WhatsApp fontSize="small" />
                  WhatsApp +923263333456
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
          Thank you for choosing Garage Tuned Autos Auto! 🚗🔧
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We appreciate your trust and look forward to serving you again.
        </Typography>
      </Box>
    </Container>
  );
};

export default RefundAndCancelation;
