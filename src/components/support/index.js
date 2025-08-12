"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Phone,
  Email,
  Chat,
  ExpandMore,
  Star,
  AccessTime,
  CheckCircle,
  HeadsetMic,
  LiveHelp,
  Article,
  VideoLibrary,
} from "@mui/icons-material";

import Iconify from "src/components/iconify";

// Dummy data for support
const SUPPORT_CATEGORIES = [
  {
    icon: "/assets/icons/faqs/ic_account.svg",
    title: "Account & Billing",
    description: "Manage your account settings and billing information",
    color: "#4caf50",
    count: 12,
  },
  {
    icon: "/assets/icons/faqs/ic_payment.svg",
    title: "Payment Issues",
    description: "Resolve payment problems and refund requests",
    color: "#4caf50",
    count: 8,
  },
  {
    icon: "/assets/icons/faqs/ic_delivery.svg",
    title: "Shipping & Delivery",
    description: "Track orders and delivery information",
    color: "#4caf50",
    count: 15,
  },
  {
    icon: "/assets/icons/faqs/ic_package.svg",
    title: "Product Support",
    description: "Get help with product features and troubleshooting",
    color: "#4caf50",
    count: 23,
  },
  {
    icon: "/assets/icons/faqs/ic_refund.svg",
    title: "Returns & Refunds",
    description: "Process returns and refund requests",
    color: "#4caf50",
    count: 6,
  },
  {
    icon: "/assets/icons/faqs/ic_assurances.svg",
    title: "Warranty & Claims",
    description: "Warranty information and claim processing",
    color: "#4caf50",
    count: 4,
  },
];

const FREQUENT_QUESTIONS = [
  {
    question: "How do I reset my password?",
    answer:
      'To reset your password, go to the login page and click on "Forgot Password". Enter your email address and follow the instructions sent to your email to create a new password.',
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days within the continental US. Express shipping (1-2 business days) and overnight shipping are also available for an additional fee.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be in original condition with all packaging intact. Some items may have different return policies.",
  },
  {
    question: "How can I track my order?",
    answer:
      'You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number provided in your shipping confirmation email.',
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please check our shipping calculator for specific rates.",
  },
];

const SUPPORT_AGENTS = [
  {
    name: "Sarah Johnson",
    role: "Senior Support Specialist",
    avatar: "/assets/images/avatar/avatar_1.jpg",
    rating: 4.9,
    responseTime: "2-4 hours",
    specialties: ["Billing", "Account Issues"],
    status: "online",
  },
  {
    name: "Michael Chen",
    role: "Technical Support Engineer",
    avatar: "/assets/images/avatar/avatar_2.jpg",
    rating: 4.8,
    responseTime: "1-3 hours",
    specialties: ["Technical Issues", "Product Support"],
    status: "online",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Success Manager",
    avatar: "/assets/images/avatar/avatar_3.jpg",
    rating: 4.9,
    responseTime: "4-6 hours",
    specialties: ["Returns", "Refunds"],
    status: "busy",
  },
];

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team",
    contact: "+923263333456",
    availability: "24/7",
    responseTime: "Immediate",
    color: "#4caf50",
  },
  {
    icon: Email,
    title: "Email Support",
    description: "Send us a detailed message",
    contact: "support@garagetunedautos.com",
    availability: "24/7",
    responseTime: "2-4 hours",
    color: "#4caf50",
  },
  {
    icon: Chat,
    title: "Live Chat",
    description: "Get instant help from our agents",
    contact: "Available on website",
    availability: "Mon-Fri, 9AM-6PM EST",
    responseTime: "Instant",
    color: "#4caf50",
  },
];

const Support = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Handler for contact button click
  const handleContactClick = (method) => {
    if (method.icon === Phone) {
      // Remove any non-digit/plus characters for tel: link
      const phone = method.contact.replace(/[^+\d]/g, "");
      window.open(`tel:${phone}`);
    } else if (method.icon === Email) {
      window.open(`mailto:${method.contact}`);
    }
    // For Chat or other methods, do nothing (or implement as needed)
  };

  return (
    <Box sx={{ backgroundColor: "#000000", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
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
            How can we help you?
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
            Get the support you need with our comprehensive help center, live
            chat, and dedicated support team.
          </Typography>

          {/* <Box sx={{ textAlign: "center", maxWidth: 500, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search for help..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& fieldset": {
                    borderColor: "#4caf50",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00ff88",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ff88",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.6)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box> */}
        </Box>

        {/* Support Categories */}
        <Box mb={8}>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              textAlign: "center",
              mb: 6,
              fontWeight: 700,
            }}>
            What do you need help with?
          </Typography>

          <Grid container spacing={3}>
            {SUPPORT_CATEGORIES.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid #4caf50",
                    borderRadius: 3,
                    transition: "all 0.4s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: "#00ff88",
                      boxShadow: "0 10px 30px rgba(0, 255, 136, 0.2)",
                    },
                  }}>
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        border: "1px solid #4caf50",
                      }}>
                      <Iconify
                        icon={category.icon}
                        sx={{
                          width: 30,
                          height: 30,
                          color: "#4caf50",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        color: "#4caf50",
                        mb: 2,
                        fontWeight: 700,
                      }}>
                      {category.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.9,
                        mb: 3,
                        lineHeight: 1.6,
                      }}>
                      {category.description}
                    </Typography>

                    <Chip
                      label={`${category.count} articles`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                        color: "#fff",
                        fontWeight: 600,
                        border: "1px solid #4caf50",
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Methods */}
        <Box mb={8}>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              textAlign: "center",
              mb: 6,
              fontWeight: 700,
            }}>
            Get in touch with us
          </Typography>

          <Grid container spacing={4}>
            {CONTACT_METHODS.map((method, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid #4caf50",
                    borderRadius: 3,
                    textAlign: "center",
                    p: 4,
                  }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 255, 136, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      border: "1px solid #4caf50",
                    }}>
                    <method.icon
                      sx={{
                        width: 40,
                        height: 40,
                        color: "#4caf50",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      color: "#4caf50",
                      mb: 2,
                      fontWeight: 700,
                    }}>
                    {method.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      opacity: 0.9,
                      mb: 3,
                      lineHeight: 1.6,
                    }}>
                    {method.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00ff88",
                      mb: 2,
                      fontWeight: 600,
                    }}>
                    {method.contact}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mb: 3 }}>
                    <Chip
                      label={method.availability}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                        color: "#fff",
                        border: "1px solid #4caf50",
                      }}
                    />
                    <Chip
                      label={method.responseTime}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                        color: "#fff",
                        border: "1px solid #4caf50",
                      }}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "#000000",
                      py: 2,
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      borderRadius: 2,
                    }}
                    onClick={() => handleContactClick(method)}>
                    Contact Now
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Support Team */}
        {/* <Box mb={8}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              textAlign: "center",
              mb: 6,
              fontWeight: 700,
            }}>
            Meet our support team
          </Typography>

          <Grid container spacing={4}>
            {SUPPORT_AGENTS.map((agent, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "transparent",
                    border: "1px solid #4caf50",
                    borderRadius: 3,
                    p: 4,
                  }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 3 }}>
                    <Avatar
                      src={agent.avatar}
                      sx={{
                        width: 60,
                        height: 60,
                        border: "3px solid",
                        borderColor:
                          agent.status === "online" ? "#4caf50" : "#00ff88",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#4caf50",
                          fontWeight: 700,
                        }}>
                        {agent.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff",
                          opacity: 0.9,
                        }}>
                        {agent.role}
                      </Typography>
                    </Box>
                    <Chip
                      label={agent.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          agent.status === "online"
                            ? "rgba(0, 255, 136, 0.1)"
                            : "rgba(255, 193, 7, 0.1)",
                        color:
                          agent.status === "online" ? "#4caf50" : "#00ff88",
                        border: "1px solid",
                        borderColor:
                          agent.status === "online" ? "#4caf50" : "#00ff88",
                      }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}>
                    <Star sx={{ color: "#00ff88", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                      }}>
                      {agent.rating}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.9,
                      }}>
                      rating
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 3 }}>
                    <AccessTime
                      sx={{ color: "#ffffff", opacity: 0.7, fontSize: 20 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.9,
                      }}>
                      Response time: {agent.responseTime}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4caf50",
                      mb: 2,
                      fontWeight: 600,
                    }}>
                    Specialties:
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {agent.specialties.map((specialty, idx) => (
                      <Chip
                        key={idx}
                        label={specialty}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(0, 255, 136, 0.1)",
                          color: "#4caf50",
                          border: "1px solid #4caf50",
                          mb: 1,
                        }}
                      />
                    ))}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box> */}

        {/* FAQ Section */}
        <Box mb={8}>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              textAlign: "center",
              mb: 6,
              fontWeight: 700,
            }}>
            Frequently Asked Questions
          </Typography>

          <Paper
            sx={{
              backgroundColor: "transparent",
              border: "1px solid #4caf50",
              borderRadius: 3,
            }}>
            {FREQUENT_QUESTIONS.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  backgroundColor:
                    expanded === `panel${index}`
                      ? "transparent !important"
                      : "transparent !important",
                  "&:before": {
                    display: "none",
                  },
                  "& .MuiAccordionSummary-root": {
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(0, 255, 136, 0.05)",
                    },
                  },
                  "& .MuiAccordionDetails-root": {
                    color: "#000",
                    opacity: 0.9,
                  },
                }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "#4caf50" }} />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, color: "#fff" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Box>

        {/* CTA Section */}
        {/* <Box
          sx={{
            p: 6,
            backgroundColor: "rgba(0, 255, 136, 0.1)",
            border: "1px solid #4caf50",
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}>
          <Typography
            variant="h3"
            sx={{
              color: "#00ff88",
              mb: 3,
              fontWeight: 700,
            }}>
            Still need help?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              opacity: 0.9,
              mb: 4,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}>
            Our support team is here to help you 24/7. Don't hesitate to reach
            out for any assistance you need.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<Chat />}
              sx={{
                backgroundColor: "#4caf50",
                color: "#000000",
                px: 3,
                py: 2,
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "2px",
                borderRadius: "14px",
                "&:hover": {
                  backgroundColor: "#00ff88",
                },
                transition: "all 0.3s ease",
              }}>
              Start Live Chat
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Email />}
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                px: 3,
                py: 2,
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "2px",
                borderRadius: "14px",
                "&:hover": {
                  borderColor: "#00ff88",
                  backgroundColor: "rgba(0, 255, 136, 0.1)",
                  color: "#00ff88",
                },
                transition: "all 0.3s ease",
              }}>
              Send Email
            </Button>
          </Stack>
        </Box> */}
      </Container>
    </Box>
  );
};

export default Support;
