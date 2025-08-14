import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { _socials } from "src/_mock";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const QUICK_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Seasonal Products", href: "/seasonal-products" },
  { name: "Best Sellers", href: "/best-sellers" },
  { name: "Flash Sale", href: "/flash-sale" },
  { name: "Collections", href: "/collections" },
  { name: "Products", href: "/products" },
];

const CUSTOMER_SERVICES = [
  { name: "Support", href: "/support" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Cancellation & Refund Policy", href: "/cancellation-refund-policy" },
];

const SOCIAL_LINKS = [
  // { name: "Facebook", icon: "mdi:facebook", href: "https://m.facebook.com/GarageTunedAutos/", color: "#1877F2" },
  {
    name: "Instagram",
    icon: "mdi:instagram",
    href: "https://www.instagram.com/garagetunedautos?igsh=MTl0d3cyZWZ1OWRjag==",
    color: "#E4405F",
  },
  // { name: "LinkedIn", icon: "mdi:linkedin", href: "#", color: "#0077B5" },
  {
    name: "YouTube",
    icon: "mdi:youtube",
    href: "https://youtube.com/@garagetunedautos?si=qI3aK4AOdCpDp7ap",
    color: "#FF0000",
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();

  const homePage = pathname === "/";

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: "center",
        position: "relative",
        bgcolor: "background.default",
      }}>
      <Container>
        <Logo sx={{ mb: 1, mx: "auto" }} />

        <Typography variant="caption" component="div">
          © All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: "relative",
        background: "linear-gradient(135deg, #8B4513 0%, #4B0082 100%)",
        minHeight: { xs: "1000px", md: "550px" },
        overflow: "hidden",
        pb: { xs: 16, md: 12 }, // Increased bottom padding for mobile
      }}>
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url(/assets/footerBg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(139, 69, 19, 0.7) 0%, rgba(75, 0, 130, 0.8) 100%)",
          zIndex: 2,
        }}
      />

      <Container
        sx={{
          pt: { xs: 8, md: 10 },
          pb: { xs: 14, md: 12 }, // Increased bottom padding for mobile
          position: "relative",
          zIndex: 3,
        }}>
        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contact Us Column */}
          <Grid item xs={12} md={4}>
            {/* Logo positioned above Contact Us */}
            <Box sx={{ mb: 4, textAlign: "left" }}>
              <Box
                component="img"
                src="/assets/logo.webp"
                alt="Garage Tuned Autos"
                sx={{
                  height: { xs: "50px", md: "60px" },
                  width: "auto",
                  mb: 2,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "16px", md: "18px" },
                textTransform: "uppercase",
              }}>
              CONTACT US
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "2px",
                backgroundColor: "#4caf50",
                mb: 3,
              }}
            />

            {/* WhatsApp */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                  fontWeight: "bold",
                  minWidth: "80px",
                  fontSize: { xs: "12px", md: "14px" },
                }}>
                WhatsApp
              </Typography>
              <Link
                href="https://wa.me/+923263332888"
                target="_blank"
                rel="noopener"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textDecoration: "none",
                }}>
                <Iconify
                  icon="eva:message-circle-fill"
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: "12px", md: "14px" },
                  }}>
                  +923263332888
                </Typography>
              </Link>
            </Stack>

            {/* Call Us */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                  fontWeight: "bold",
                  minWidth: "80px",
                  fontSize: { xs: "12px", md: "14px" },
                }}>
                Call Us
              </Typography>
              <Link
                href="tel:+923263332888"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textDecoration: "none",
                }}>
                <Iconify
                  icon="eva:phone-fill"
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: "12px", md: "14px" },
                  }}>
                  +923263332888
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "16px", md: "18px" },
                textTransform: "uppercase",
              }}>
              QUICK LINKS
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "2px",
                backgroundColor: "#4caf50",
                mb: 3,
              }}
            />

            <Stack spacing={1}>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  href={link.href}
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: { xs: "12px", md: "14px" },
                    "&:hover": {
                      color: "#4caf50",
                    },
                  }}>
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Customer Services Column */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "16px", md: "18px" },
                textTransform: "uppercase",
              }}>
              CUSTOMER SERVICES
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "2px",
                backgroundColor: "#4caf50",
                mb: 3,
              }}
            />

            <Stack spacing={1} sx={{ mb: 4 }}>
              {CUSTOMER_SERVICES.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  href={link.href}
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: { xs: "12px", md: "14px" },
                    "&:hover": {
                      color: "#4caf50",
                    },
                  }}>
                  {link.name}
                </Link>
              ))}
            </Stack>

            {/* Social Links */}
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "16px", md: "18px" },
                textTransform: "uppercase",
              }}>
              SOCIAL LINKS
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "2px",
                backgroundColor: "#4caf50",
                mb: 3,
              }}
            />

            <Stack direction="row" spacing={2}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.href}
                  target="_blank"
                  sx={{
                    color: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    width: { xs: "36px", md: "40px" },
                    height: { xs: "36px", md: "40px" },
                    "&:hover": {
                      color: "#4caf50",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.1)",
                    },
                  }}>
                  <Iconify
                    icon={social.icon}
                    sx={{ fontSize: { xs: "18px", md: "20px" } }}
                  />
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              fontSize: { xs: "12px", md: "14px" },
            }}>
            © 2025 Garage Tuned Autos. All rights reserved. Powered by Digital
            Stay Active
          </Typography>
        </Box>
      </Container>

      {/* Floating Chat Icon */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "10px", md: "20px" },
          right: { xs: "10px", md: "20px" },
          zIndex: 1000,
        }}>
        <Stack spacing={1}>
          <Box
            sx={{
              width: { xs: "40px", md: "50px" },
              height: { xs: "40px", md: "50px" },
              backgroundColor: "#2196f3",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}>
            <Iconify
              icon="eva:message-circle-fill"
              sx={{ color: "#ffffff", fontSize: { xs: "18px", md: "24px" } }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "40px", md: "50px" },
              height: { xs: "40px", md: "50px" },
              backgroundColor: "#4caf50",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}>
            <Iconify
              icon="eva:arrow-up-fill"
              sx={{ color: "#ffffff", fontSize: { xs: "18px", md: "24px" } }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  // return homePage ? simpleFooter : mainFooter;
  return mainFooter;
}
