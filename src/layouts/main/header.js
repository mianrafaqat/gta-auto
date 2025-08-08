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
import { useCheckoutContext } from "src/sections/checkout/context";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const { user = {} } = useAuthContext()?.user || {};

  // Get cart data from checkout context
  const checkout = useCheckoutContext();
  const cartItems = checkout?.totalItems || 0;

  // Cart drawer state
  const [openCartDrawer, setOpenCartDrawer] = useState(false);

  const handleOpenCartDrawer = () => {
    setOpenCartDrawer(true);
  };

  const handleCloseCartDrawer = () => {
    setOpenCartDrawer(false);
  };

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
                onClick={handleOpenCartDrawer}
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
              <MoveTo
                title="Favourite"
                path={paths.user.favourites}
                sx={{ color: "white", borderColor: "black" }}
              />
            )}

            {!mdUp && <NavMobile data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {/* Cart Drawer */}
      <CartDrawer
        open={openCartDrawer}
        onClose={handleCloseCartDrawer}
        checkout={checkout}
      />
    </AppBar>
  );
}

// Cart Drawer Component
function CartDrawer({ open, onClose, checkout }) {
  const theme = useTheme();
  const router = useRouter();

  const handleBuyNow = () => {
    // If there's only one item, use Buy Now flow
    if (checkout?.items?.length === 1) {
      const item = checkout.items[0];
      checkout.onBuyNow(item);
    }
    onClose();
    // Small delay to ensure smooth transition
    setTimeout(() => {
      router.push(paths.product.checkout);
    }, 100);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1299,
          }}
        />
      )}

      {/* Cart Drawer */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: { xs: "100%", sm: 400 },
          height: "100vh",
          zIndex: 1300,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          backgroundColor: "background.paper",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Iconify icon="eva:shopping-cart-fill" />
            <Typography variant="h6">
              Cart ({checkout?.totalItems || 0})
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        {/* Cart Content */}
        <Box sx={{ height: "calc(100vh - 140px)", overflow: "auto" }}>
          {checkout?.items?.length > 0 ? (
            <Box sx={{ p: 2 }}>
              {checkout.items.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onDelete={checkout.onDeleteCart}
                  onIncreaseQuantity={checkout.onIncreaseQuantity}
                  onDecreaseQuantity={checkout.onDecreaseQuantity}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Iconify
                icon="eva:shopping-cart-outline"
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some items to get started
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {checkout?.items?.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  PKR {checkout?.subTotal?.toLocaleString() || 0}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  PKR {checkout?.total?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {
                  onClose();
                  // Small delay to ensure smooth transition
                  setTimeout(() => {
                    router.push(paths.product.checkout);
                  }, 100);
                }}
                sx={{
                  borderColor: "#4caf50",
                  color: "#4caf50",
                  "&:hover": {
                    borderColor: "#45a049",
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  },
                }}>
                View Cart
              </Button>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBuyNow}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}>
                Buy Now
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
}

// Cart Item Component
function CartItem({ item, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        display: "flex",
        gap: 2,
      }}>
      <Box
        component="img"
        src={item.coverUrl || item.image?.[0]}
        alt={item.name}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          objectFit: "cover",
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          PKR {item.price?.toLocaleString()}
        </Typography>

        {/* Show car details if available */}
        {item.carDetails && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}>
            {item.carDetails.make} {item.carDetails.model} •{" "}
            {item.carDetails.yearOfManufacture}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onDecreaseQuantity(item.id)}
            disabled={item.quantity <= 1}>
            <Iconify icon="eva:minus-fill" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ minWidth: 30, textAlign: "center" }}>
            {item.quantity}
          </Typography>
          <IconButton size="small" onClick={() => onIncreaseQuantity(item.id)}>
            <Iconify icon="eva:plus-fill" />
          </IconButton>
        </Box>
      </Box>

      <IconButton
        size="small"
        onClick={() => onDelete(item.id)}
        sx={{ color: "error.main" }}>
        <Iconify icon="eva:trash-2-fill" />
      </IconButton>
    </Box>
  );
}

function MoveTo({ sx, title, path }) {
  return (
    <Button
      component={Link}
      href={path}
      sx={{
        color: "white",
        borderColor: "black",
        ...sx,
      }}
      variant="outlined">
      {title}
    </Button>
  );
}
