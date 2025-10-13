"use client";

import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  alpha,
} from "@mui/material";
import {
  Security,
  Business,
  Event,
  CheckCircle,
  Shield,
  Verified,
} from "@mui/icons-material";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const GUARD_SERVICES = [
  {
    id: "security_guard",
    title: "Security Guard",
    description:
      "Professional unarmed security guard for general surveillance and access control.",
    icon: Security,
    color: "#4caf50",
    features: [
      "Access Control",
      "Property Surveillance",
      "Visitor Management",
      "Incident Reporting",
    ],
    image: "/assets/Security-Guard.jpg",
  },
  {
    id: "security_guard_gun",
    title: "Security Guard with Gun",
    description:
      "Armed security guard providing enhanced protection for high-risk environments.",
    icon: Shield,
    color: "#f44336",
    features: [
      "Armed Protection",
      "High-Risk Security",
      "Licensed & Trained",
      "Emergency Response",
    ],
    image: "/assets/Security-Guard-1.jpg",
  },
  {
    id: "two_guard",
    title: "Two Guards",
    description:
      "Dual security guard team for comprehensive coverage and enhanced security presence.",
    icon: Business,
    color: "#2196f3",
    features: [
      "Team Coverage",
      "24/7 Rotation",
      "Enhanced Surveillance",
      "Coordinated Response",
    ],
    image: "/assets/Security-Guard-2.jpg",
  },
  {
    id: "guard_squad",
    title: "Guard Squad",
    description:
      "Full security squad for large-scale operations, events, and high-security requirements.",
    icon: Verified,
    color: "#ff9800",
    features: [
      "Multiple Personnel",
      "Complete Coverage",
      "Event Security",
      "Tactical Coordination",
    ],
    image: "/assets/Security-Guard-3.jpg",
  },
];

// ----------------------------------------------------------------------

export default function GuardView() {
  const [selectedService, setSelectedService] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Dynamic validation schema based on selected service
  const getValidationSchema = () => {
    const baseSchema = {
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email must be a valid email address"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Service location is required"),
      message: Yup.string()
        .required("Message is required")
        .min(20, "Message must be at least 20 characters"),
    };

    // Add service-specific fields
    if (selectedService === "security_guard" || selectedService === "security_guard_gun") {
      return Yup.object().shape({
        ...baseSchema,
        durationType: Yup.string().required("Duration type is required"),
        startDate: Yup.string().required("Start date is required"),
      });
    }

    if (selectedService === "two_guard") {
      return Yup.object().shape({
        ...baseSchema,
        durationType: Yup.string().required("Duration type is required"),
        startDate: Yup.string().required("Start date is required"),
        shiftPreference: Yup.string().required("Shift preference is required"),
      });
    }

    if (selectedService === "guard_squad") {
      return Yup.object().shape({
        ...baseSchema,
        numberOfGuards: Yup.string().required("Number of guards is required"),
        durationType: Yup.string().required("Duration type is required"),
        startDate: Yup.string().required("Start date is required"),
        eventType: Yup.string().required("Event/Location type is required"),
      });
    }

    return Yup.object().shape(baseSchema);
  };

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    durationType: "",
    startDate: "",
    shiftPreference: "",
    numberOfGuards: "",
    eventType: "",
  };

  const methods = useForm({
    resolver: yupResolver(getValidationSchema()),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    // Reset form when switching services
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const quoteData = {
        service: selectedService,
        ...data,
      };

      // Send quote request email
      const response = await fetch("/api/guard/send-quote-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send quote request");
      }

      enqueueSnackbar(
        "Quote request submitted successfully! We'll get back to you within 24 hours.",
        {
          variant: "success",
        }
      );

      reset();
      setSelectedService(null);
    } catch (error) {
      console.error("Quote submission error:", error);
      enqueueSnackbar(
        error.message || "Failed to submit quote request. Please try again.",
        {
          variant: "error",
        }
      );
    }
  });

  const renderServiceCards = (
    <Grid container spacing={3} mb={6}>
      {GUARD_SERVICES.map((service) => {
        const Icon = service.icon;
        const isSelected = selectedService === service.id;

        return (
          <Grid item xs={12} sm={6} md={3} key={service.id}>
            <Card
              onClick={() => handleServiceSelect(service.id)}
              sx={{
                minHeight: "500px",
                height: "100%",
                cursor: "pointer",
                position: "relative",
                border: isSelected
                  ? `2px solid ${service.color}`
                  : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: isSelected
                  ? alpha(service.color, 0.08)
                  : "transparent",
                transition: "all 0.3s ease",
                backgroundImage: `url(${service.image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 0,
                },
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 40px ${alpha(service.color, 0.3)}`,
                  borderColor: service.color,
                },
              }}>
              {isSelected && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 18 }} />}
                    label="Selected"
                    size="small"
                    sx={{
                      backgroundColor: service.color,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ p: 4, height: "100%" }}>
                <Stack spacing={3} height="100%">
                  {/* Icon */}
                  {/* <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: alpha(service.color, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${service.color}`,
                    }}>
                    <Icon
                      sx={{
                        width: 40,
                        height: 40,
                        color: service.color,
                      }}
                    />
                  </Box> */}

                

                  {/* Select Button */}
                  <Box sx={{ mt: "auto", position: "relative", zIndex: 1 }}>
                    <Button
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      sx={{
                        py: 1.5,
                        borderColor: service.color,
                        color: isSelected ? "#fff" : "#fff",
                        backgroundColor: isSelected ? service.color : "rgba(0,0,0,0.6)",
                        fontWeight: 600,
                        border: `2px solid ${service.color}`,
                        "&:hover": {
                          borderColor: service.color,
                          backgroundColor: isSelected
                            ? service.color
                            : alpha(service.color, 0.3),
                        },
                      }}>
                      {isSelected ? "Selected" : "Select Service"}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderQuoteForm = selectedService && (
    <Paper
      sx={{
        p: 4,
        backgroundColor: "transparent",
        border: "1px solid rgba(76, 175, 80, 0.3)",
        borderRadius: 3,
      }}>
      <Stack spacing={3}>
        <Box textAlign="center" mb={2}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              mb: 2,
              fontWeight: 700,
            }}>
            Request a Quote
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              opacity: 0.85,
            }}>
            Fill out the form below and we'll get back to you within 24 hours
          </Typography>
        </Box>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {/* Common Fields */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="email"
                label="Email Address"
                placeholder="your.email@example.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="phone"
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
              />
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="address"
                label="Service Location / Address"
                placeholder="Enter the location where security is needed"
              />
            </Grid>

            {/* Service-specific fields */}
            {(selectedService === "security_guard" || selectedService === "security_guard_gun") && (
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="durationType"
                    label="Duration Type"
                    placeholder="e.g., Daily, Weekly, Monthly, One-time Event"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {selectedService === "two_guard" && (
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="durationType"
                    label="Duration Type"
                    placeholder="e.g., Daily, Weekly, Monthly"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="shiftPreference"
                    label="Shift Preference"
                    placeholder="e.g., Day Shift, Night Shift, 24/7 Rotation"
                  />
                </Grid>
              </>
            )}

            {selectedService === "guard_squad" && (
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="numberOfGuards"
                    label="Number of Guards Needed"
                    placeholder="e.g., 3-5, 5-10, 10+"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="eventType"
                    label="Event/Location Type"
                    placeholder="e.g., Concert, Corporate Event, Building Complex"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="durationType"
                    label="Duration Type"
                    placeholder="e.g., One-time Event, Weekly, Monthly"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {/* Message */}
            <Grid item xs={12}>
              <RHFTextField
                name="message"
                label="Additional Details"
                placeholder="Tell us more about your security needs..."
                multiline
                rows={4}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setSelectedService(null);
                    reset();
                  }}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    "&:hover": {
                      borderColor: "#66bb6a",
                      backgroundColor: alpha("#4caf50", 0.08),
                    },
                  }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#66bb6a",
                    },
                  }}>
                  {isSubmitting ? "Submitting..." : "Request Quote"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        pt: { xs: 12, md: 15 },
        pb: 10,
      }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#4caf50",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}>
            Professional Security Guard Services
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 800,
              mx: "auto",
              color: "#fff",
              opacity: 0.85,
              lineHeight: 1.8,
              mb: 2,
            }}>
            Choose from single guard to full security squad solutions. Our trained
            professionals provide reliable protection for your property, business,
            or event. Select a service below to get a custom quote.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            sx={{ mt: 3 }}>
            <Chip
              icon={<Verified sx={{ fontSize: 18 }} />}
              label="Licensed & Insured"
              sx={{
                backgroundColor: alpha("#4caf50", 0.1),
                color: "#4caf50",
                fontWeight: 600,
                border: "1px solid #4caf50",
                px: 1,
              }}
            />
            <Chip
              icon={<Shield sx={{ fontSize: 18 }} />}
              label="Trained Professionals"
              sx={{
                backgroundColor: alpha("#4caf50", 0.1),
                color: "#4caf50",
                fontWeight: 600,
                border: "1px solid #4caf50",
                px: 1,
              }}
            />
            <Chip
              icon={<CheckCircle sx={{ fontSize: 18 }} />}
              label="24/7 Available"
              sx={{
                backgroundColor: alpha("#4caf50", 0.1),
                color: "#4caf50",
                fontWeight: 600,
                border: "1px solid #4caf50",
                px: 1,
              }}
            />
          </Stack>
        </Box>

        {/* Service Cards */}
        {renderServiceCards}

        {/* Quote Form */}
        {renderQuoteForm}

        {/* No Service Selected Message */}
        {!selectedService && (
          <Box textAlign="center" py={6}>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                opacity: 0.6,
              }}>
              👆 Select a service above to request a quote
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

