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
  { name: "Facebook", icon: "eva:facebook-fill", href: "#", color: "#1877F2" },
  { name: "Instagram", icon: "eva:instagram-fill", href: "#", color: "#E4405F" },
  { name: "LinkedIn", icon: "eva:linkedin-fill", href: "#", color: "#0077B5" },
  { name: "YouTube", icon: "eva:youtube-fill", href: "#", color: "#FF0000" },
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
      }}
    >
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
        minHeight: "500px",
        overflow: "hidden",
        pb: 8, // Add bottom padding
      }}
    >
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
          background: "linear-gradient(135deg, rgba(139, 69, 19, 0.7) 0%, rgba(75, 0, 130, 0.8) 100%)",
          zIndex: 2,
        }}
      />

      <Container
        sx={{
          pt: 8,
          pb: 8, // Increased bottom padding
          position: "relative",
          zIndex: 3,
        }}
      >
        {/* Logo Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: { xs: "24px", md: "32px" },
              textTransform: "uppercase",
              fontFamily: "monospace",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              letterSpacing: "2px",
            }}
          >
            GARAGE TUNED AUTOS
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Contact Us Column */}
          <Grid xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: "18px",
                textTransform: "uppercase",
              }}
            >
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
            <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  minWidth: "80px",
                }}
              >
                WhatsApp
              </Typography>
              <Iconify icon="eva:message-circle-fill" sx={{ color: "#ffffff", fontSize: "20px" }} />
              <Typography variant="body2" sx={{ color: "#ffffff" }}>
                +1 202-918-2132
              </Typography>
            </Stack>

            {/* Call Us */}
            <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  minWidth: "80px",
                }}
              >
                Call Us
              </Typography>
              <Iconify icon="eva:phone-fill" sx={{ color: "#ffffff", fontSize: "20px" }} />
              <Typography variant="body2" sx={{ color: "#ffffff" }}>
                +1 202-918-2132
              </Typography>
            </Stack>
          </Grid>

          {/* Quick Links Column */}
          <Grid xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: "18px",
                textTransform: "uppercase",
              }}
            >
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
                    fontSize: "14px",
                    "&:hover": {
                      color: "#4caf50",
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Customer Services Column */}
          <Grid xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
                fontSize: "18px",
                textTransform: "uppercase",
              }}
            >
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
                    fontSize: "14px",
                    "&:hover": {
                      color: "#4caf50",
                    },
                  }}
                >
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
                fontSize: "18px",
                textTransform: "uppercase",
              }}
            >
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

            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.href}
                  target="_blank"
                  sx={{
                    color: "#ffffff",
                    "&:hover": {
                      color: "#4caf50",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Iconify icon={social.icon} sx={{ fontSize: "24px" }} />
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              fontSize: "14px",
            }}
          >
            © 2025 Garage Tuned Autos. All rights reserved. Powered by Digital Stay Active
          </Typography>
        </Box>
      </Container>

      {/* Floating Shopping Cart Icon */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            width: "50px",
            height: "50px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <Iconify icon="eva:shopping-cart-fill" sx={{ color: "#000000", fontSize: "24px" }} />
          <Box
            sx={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              width: "20px",
              height: "20px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              0
            </Typography>
          </Box>
        </Box>
      </Box> */}

      {/* Floating Chat Icon */}
      <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Stack spacing={1}>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              backgroundColor: "#2196f3",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
          >
            <Iconify icon="eva:message-circle-fill" sx={{ color: "#ffffff", fontSize: "24px" }} />
          </Box>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              backgroundColor: "#4caf50",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
          >
            <Iconify icon="eva:arrow-up-fill" sx={{ color: "#ffffff", fontSize: "24px" }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  // return homePage ? simpleFooter : mainFooter;
  return mainFooter;
}
