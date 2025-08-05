"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

import { paths } from "src/routes/paths";

import { useOffSetTop } from "src/hooks/use-off-set-top";
import { useResponsive } from "src/hooks/use-responsive";

import { bgBlur } from "src/theme/css";

// import Logo from 'src/components/logo';
import Label from "src/components/label";
import Iconify from "src/components/iconify";

import NavMobile from "./nav/mobile";
import NavDesktop from "./nav/desktop";
import { HEADER } from "../config-layout";
import { navConfig } from "./config-navigation";
import LoginButton from "../common/login-button";
import HeaderShadow from "../common/header-shadow";
import SettingsButton from "../common/settings-button";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const { user = {} } = useAuthContext()?.user || {};

  // Cart state - you can replace this with your actual cart state management
  const [cartItems, setCartItems] = useState(0);

  return (
    <AppBar
      sx={{
        backgroundImage: `url('/assets/webnavigation.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <Toolbar
        disableGutters
        sx={{
          // boxShadow: "rgba(0, 0, 0, 0.09) 0px 25px 20px -20px",
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            // ...bgBlur({
            //   color: theme.palette.background.default,
            // }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}>
        <Container
          maxWidth="xl"
          sx={{ height: 1, display: "flex", alignItems: "center" }}>
          <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
            {/* <Logo />  */}
            <img
              src="/assets/logo.webp"
              alt="logo"
              width="190px"
              height="29px"
              style={{ marginRight: "24px" }}
            />
            {mdUp && <NavDesktop data={navConfig} />}
          </Stack>

          <Stack alignItems="center" direction="row" spacing={2}>
            {/* Shopping Cart */}
            <Badge
              badgeContent={cartItems}
              showZero
              color="error"
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  backgroundColor: "#4caf50",
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "12px",
                  minWidth: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}>
              <IconButton
                sx={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  width: "40px",
                  height: "40px",
                  border: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "scale(1.05)",
                  },
                }}>
                <Iconify
                  icon="eva:shopping-cart-fill"
                  sx={{ fontSize: "20px" }}
                />
              </IconButton>
            </Badge>

            {mdUp && !Object.keys(user).length > 0 && <LoginButton />}
            {mdUp && Object.keys(user).length > 0 && (
              <MoveTo
                sx={{ color: "white", borderColor: "black" }}
                title="Move to Dashboard"
                path={paths.dashboard.root}
              />
            )}
            {mdUp && Object.keys(user).length > 0 && (
              <MoveTo title="Favourite" path={paths.user.favourites} />
            )}

            {!mdUp && <NavMobile data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}

function MoveTo({ sx, title, path }) {
  return (
    <Button href={path} variant="outlined" sx={{ mr: 1, ...sx }}>
      {title}
    </Button>
  );
}
