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

const LINKS = [
  {
    headline: "Contact",
    children: [
      { name: "info@cityautos.co.uk", href: "mailto:info@cityautos.co.uk" },
      { name: "Terms and Conditions", href: "/terms-and-conditions" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
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
        bgcolor: "background.default",
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: "center", md: "unset" },
        }}
      >
        <Logo sx={{ mb: 3 }} />

        <Grid
          container
          justifyContent={{
            xs: "center",
            md: "space-between",
          }}
        >
          <Grid xs={8} md={4}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: "auto", md: "unset" },
              }}
            >
              City Autos is a London-based web and app service that offers a
              platform for buying and selling cars for free. We provide a wide
              range of vehicles to meet your transportation needs. Our platform
              is completely free of charge and offers extensive options for
              buying and selling
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <a href={social.path} target="_blank">
                  <IconButton
                    key={social.name}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(social.color, 0.08),
                      },
                    }}
                  >
                    <Iconify color={social.color} icon={social.icon} />
                  </IconButton>
                </a>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={5} direction={{ xs: "column", md: "row" }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: "center", md: "flex-start" }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography component="div" variant="overline">
              Install App
            </Typography>
            <Typography py={2}>From App Store or Google Play</Typography>
            <Box
              alignItems="center"
              display="flex"
              gap="10px"
              sx={{
                justifyContent: { xs: "center", md: "start" },
              }}
            >
              <a
                style={{
                  width: "35%",
                }}
                href="https://apps.apple.com/us/app/city-autos/id1673149735"
                className="hover-up mb-sm-2 mb-lg-0"
              >
                <img className="active" src="/assets/appstore.png" alt="" />
              </a>
              <a
                style={{
                  width: "35%",
                }}
                href="https://play.google.com/store/apps/details?id=com.render.cityautos"
                className="hover-up mb-sm-2"
              >
                <img src="/assets/googleplay.png" alt="" />
              </a>
            </Box>
            <Grid container flexDirection="row" flexWrap="nowrap">
              <Grid xs={4} md={4} lg={4}></Grid>
              <Grid xs={4} md={4} lg={4}></Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © 2024. All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  // return homePage ? simpleFooter : mainFooter;
  return mainFooter;
}
