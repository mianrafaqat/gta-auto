'use client';

import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

import { Box, Fab, Button, useTheme, Badge, IconButton, Typography, Stack, Drawer } from '@mui/material';
import { 
  HomeRounded, 
  CampaignRounded, 
  AddRounded, 
  ShoppingCartRounded, 
  MenuRounded,
  ScienceRounded
} from '@mui/icons-material';
import { paths } from 'src/routes/paths';
import { useCheckoutContext } from 'src/sections/checkout/context';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    title: 'Home',
    icon: HomeRounded,
    path: '/',
  },
  {
    title: 'Chemicals',
    icon: ScienceRounded,
    path: '/chemicals',
  },
  {
    title: 'Sell',
    icon: AddRounded,
    path: '/cars',
    isFab: true,
  },
  {
    title: 'Cart',
    icon: ShoppingCartRounded,
    path: '/shop/cart',
    isCart: true,
  },
  {
    title: 'More',
    icon: MenuRounded,
    path: '/dashboard',
    isMore: true,
  },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const checkout = useCheckoutContext();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openMoreDialog, setOpenMoreDialog] = useState(false);

  const cartItems = checkout?.totalItems || 0;

  const handleNavigation = (path, isCart, isMore) => {
    if (isCart) {
      setOpenCartDrawer(true);
    } else if (isMore) {
      setOpenMoreDialog(true);
    } else {
      router.push(path);
    }
  };

  const handleCloseCartDrawer = () => {
    setOpenCartDrawer(false);
  };

  const handleCloseMoreDialog = () => {
    setOpenMoreDialog(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#000',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100,
        alignItems: 'center',
        justifyContent: 'space-around',
        px: 2,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        const IconComponent = item.icon;

        if (item.isFab) {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                top: -10,
              }}
            >
              <Fab
                color="primary"
                size="medium"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  width: 56,
                  height: 56,
                  boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <IconComponent sx={{ fontSize: 28 }} />
              </Fab>
              <Box
                component="span"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  mt: 0.5,
                }}
              >
                {item.title}
              </Box>
            </Box>
          );
        }

        return (
          <Button
            key={item.title}
            onClick={() => handleNavigation(item.path, item.isCart, item.isMore)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'auto',
              flex: 1,
              py: 1,
              px: 0,
              color: active ? theme.palette.primary.main : '#fff',
              '&:hover': {
                backgroundColor: 'transparent',
                color: theme.palette.primary.light,
              },
            }}
          >
            {item.isCart ? (
              <Badge 
                badgeContent={cartItems} 
                color="error"
                max={99}
                sx={{
                  mb: 0.5,
                  '& .MuiBadge-badge': {
                    fontSize: 10,
                    height: 18,
                    minWidth: 18,
                  }
                }}
              >
                <IconComponent
                  sx={{
                    fontSize: 24,
                    color: active ? theme.palette.primary.main : '#fff',
                  }}
                />
              </Badge>
            ) : (
              <IconComponent
                sx={{
                  fontSize: 24,
                  mb: 0.5,
                  color: active ? theme.palette.primary.main : '#fff',
                }}
              />
            )}
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                textTransform: 'capitalize',
                color: active ? theme.palette.primary.main : '#fff',
              }}
            >
              {item.title}
            </Box>
          </Button>
        );
      })}
      <CartDrawer 
        open={openCartDrawer} 
        onClose={handleCloseCartDrawer} 
        checkout={checkout} 
      />
      <MoreDialog 
        open={openMoreDialog} 
        onClose={handleCloseMoreDialog}
        router={router}
      />
    </Box>
  );
}

MobileBottomNav.propTypes = {};

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
              Cart ({checkout?.items?.length || 0})
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        {/* Cart Content */}
        <Box sx={{ height: "calc(100vh - 140px)", overflow: "auto" }}>
          {!checkout?.items?.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                p: 3,
              }}>
              <Iconify
                icon="eva:shopping-cart-outline"
                sx={{ width: 80, height: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Your cart is empty
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {checkout.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDelete={() => checkout.onDeleteCart(item.id)}
                  onIncreaseQuantity={() => checkout.onIncreaseQuantity(item.id)}
                  onDecreaseQuantity={() => checkout.onDecreaseQuantity(item.id)}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer with total and checkout button */}
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
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">
                  PKR {checkout?.subtotal?.toLocaleString() || 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" sx={{ color: "#4caf50" }}>
                  PKR {checkout?.total?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    router.push(paths.product.checkout);
                  }, 100);
                }}
                sx={{
                  borderColor: "#4caf50",
                  color: "#4caf50",
                  height: 48,
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
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    router.push(paths.product.checkout);
                  }, 100);
                }}
                sx={{
                  backgroundColor: "#4caf50",
                  height: 48,
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}>
                Checkout
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
        display: "flex",
        gap: 2,
        mb: 2,
        pb: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
        }}>
        <img
          src={item.coverUrl}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap sx={{ mb: 0.5 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          PKR {item.price?.toLocaleString()}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={onDecreaseQuantity}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              width: 28,
              height: 28,
            }}>
            <Iconify icon="eva:minus-fill" width={16} />
          </IconButton>
          <Typography variant="body2" sx={{ minWidth: 20, textAlign: "center" }}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={onIncreaseQuantity}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              width: 28,
              height: 28,
            }}>
            <Iconify icon="eva:plus-fill" width={16} />
          </IconButton>
        </Box>
      </Box>

      <IconButton
        size="small"
        onClick={onDelete}
        sx={{
          color: "error.main",
          alignSelf: "flex-start",
        }}>
        <Iconify icon="eva:trash-2-outline" />
      </IconButton>
    </Box>
  );
}

CartDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  checkout: PropTypes.object,
};

CartItem.propTypes = {
  item: PropTypes.object,
  onDelete: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
};

// More Drawer Component (Bottom Sheet)
function MoreDialog({ open, onClose, router }) {
  const theme = useTheme();

  const handleLogin = () => {
    onClose();
    router.push(paths.auth.jwt.login);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: '60vh',
          maxHeight: 600,
        },
      }}
    >
      {/* Handle Bar */}
      <Box
        sx={{
          width: 40,
          height: 4,
          backgroundColor: 'divider',
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'calc(100% - 24px)',
        }}
      >
        {/* Icon and Title */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
            }}
          >
            <MenuRounded sx={{ fontSize: 36, color: '#fff' }} />
          </Box>
        </Box>

        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
            fontSize: '1.75rem',
          }}
        >
          Welcome!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 2, px: 2, fontSize: '0.95rem' }}
        >
          Sign in to access your account and explore more features
        </Typography>

        {/* Spacer to push buttons to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Buttons */}
        <Stack spacing={1.5} sx={{ width: '100%', mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleLogin}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
              },
            }}
          >
            Login / Sign Up
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={onClose}
            sx={{
              py: 1.25,
              fontSize: '0.9rem',
              borderRadius: 2,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: 'rgba(76, 175, 80, 0.04)',
              },
            }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

MoreDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  router: PropTypes.object,
};
