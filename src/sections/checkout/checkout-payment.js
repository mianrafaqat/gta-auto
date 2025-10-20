import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import { useCheckoutContext } from "./context";
import CheckoutSummary from "./checkout-summary";
import CheckoutDelivery from "./checkout-delivery";
import CheckoutBillingInfo from "./checkout-billing-info";
import CheckoutPaymentMethods from "./checkout-payment-methods";
import { useCreateOrder } from "src/hooks/use-orders";
import { useSendOrderEmails } from "src/hooks/use-email";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import OrderSuccess from "./order-success";
import { useState, useEffect, useMemo } from "react";
import { StripePaymentWrapper } from "src/components/stripe";

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    id: "689d373f5099e06126e689ca",
    value: 250,
    label: "Standard Delivery",
    description: "3-5 Business Days",
  },
  // {
  //   id: "689d373f5099e06126e689cd",
  //   value: 3600,
  //   label: "Express Delivery",
  //   description: "1-2 Business Days",
  // },
  // {
  //   id: "689d373f5099e06126e689d0",
  //   value: 7200,
  //   label: "Premium Delivery",
  //   description: "Same Day (Limited Areas)",
  // },
];

const PAYMENT_OPTIONS = [
  // {
  //   value: 'paypal',
  //   label: 'Pay with Paypal',
  //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
  // },
  // {
  //   value: 'credit',
  //   label: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  // },
  {
    value: "cash",
    label: "Cash",
    description: "Pay with cash when your order is delivered.",
  },
  {
    value: "stripe",
    label: "Credit/Debit Card",
    description: "Pay securely with your credit or debit card via Stripe.",
  },
];

const CARDS_OPTIONS = [
  { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
];

export default function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const createOrderMutation = useCreateOrder();
  const sendOrderEmailsMutation = useSendOrderEmails();
  const [order, setOrder] = useState(null);
  const [stripePaymentIntent, setStripePaymentIntent] = useState(null);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [paymentAttempts, setPaymentAttempts] = useState(0);
  
  const PaymentSchema = Yup.object().shape({
    delivery: Yup.string().required("Delivery method is required"),
    payment: Yup.string().required("Payment is required"),
  });

  const defaultValues = {
    delivery: checkout.shipping || DELIVERY_OPTIONS[0].id,
    payment: "cash",
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const selectedPayment = watch("payment");

  // Apply default shipping on component mount
  useEffect(() => {
    // Force shipping to always be 250
    if (checkout.shipping !== 250) {
      checkout.onApplyShipping(250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout.shipping]);

  // Function to create order with Stripe payment
  const createOrderWithStripePayment = async (paymentIntent) => {
    try {
      // Validate required data
      if (!checkout.items || checkout.items.length === 0) {
        enqueueSnackbar("No items in cart", { variant: "error" });
        throw new Error("No items in cart");
      }

      if (!checkout.billing) {
        enqueueSnackbar("Please provide billing information", {
          variant: "error",
        });
        throw new Error("No billing information");
      }

      // Prepare order data
      const orderData = {
        items: checkout.items.map((item) => ({
          product: item.id,
          variation: item.colors?.[0] || null,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName:
            checkout.billing?.firstName ||
            checkout.billing?.name?.split(" ")[0] ||
            "",
          lastName:
            checkout.billing?.lastName ||
            checkout.billing?.name?.split(" ").slice(1).join(" ") ||
            "",
          address1: checkout.billing?.fullAddress || "",
          city: checkout.billing?.city || "",
          state: checkout.billing?.state || "",
          postcode: checkout.billing?.postcode || "",
          country: checkout.billing?.country || "",
          email: checkout.billing?.email || "",
          phone: checkout.billing?.phoneNumber || "",
        },
        billingAddress: {
          firstName:
            checkout.billing?.firstName ||
            checkout.billing?.name?.split(" ")[0] ||
            "",
          lastName:
            checkout.billing?.lastName ||
            checkout.billing?.name?.split(" ").slice(1).join(" ") ||
            "",
          address1: checkout.billing?.fullAddress || "",
          city: checkout.billing?.city || "",
          state: checkout.billing?.state || "",
          postcode: checkout.billing?.postcode || "",
          country: checkout.billing?.country || "",
          email: checkout.billing?.email || "",
          phone: checkout.billing?.phoneNumber || "",
        },
        shippingMethod: DELIVERY_OPTIONS[0].id,
        paymentMethod: "stripe",
        couponCode: checkout.discount > 0 ? "DISCOUNT10" : undefined,
        stripePaymentIntentId: paymentIntent.id,
        paymentStatus: "paid",
      };

      const order = await createOrderMutation.mutateAsync(orderData);
      setOrder(order);

      // Handle order number
      const orderNumber =
        order.order?.orderNumber ||
        order.order?.order_number ||
        order.order?.id ||
        order.order._id ||
        "Unknown";

      // Prepare customer data for email
      const customer = {
        name: checkout.billing?.firstName && checkout.billing?.lastName 
          ? `${checkout.billing.firstName} ${checkout.billing.lastName}`
          : checkout.billing?.name || "Customer",
        email: checkout.billing?.email || order.shippingAddress?.email
      };

      // Send emails
      try {
        const emailResults = await sendOrderEmailsMutation.mutateAsync({
          order: order.order || order,
          customer
        });

        const hasErrors = emailResults.errors && emailResults.errors.length > 0;
        const hasSuccess = emailResults.confirmation || emailResults.adminNotification;

        if (hasSuccess && !hasErrors) {
          enqueueSnackbar(
            `Order #${orderNumber} created successfully!`,
            { variant: "success" }
          );
        }
      } catch (emailError) {
        // Don't throw, email failure shouldn't stop the order
      }

      // Clear checkout and redirect
      checkout.onClearState();
      router.push(paths.product.orderSuccess);
      
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to create order. Please contact support.",
        { variant: "error" }
      );
      throw error; // Re-throw so the payment form knows it failed
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validate required data
      if (!checkout.items || checkout.items.length === 0) {
        enqueueSnackbar("No items in cart", { variant: "error" });
        return;
      }

      if (!checkout.billing) {
        enqueueSnackbar("Please provide billing information", {
          variant: "error",
        });
        return;
      }

      // Skip if Stripe payment (already handled in handleStripePaymentSuccess)
      if (data.payment === "stripe") {
        enqueueSnackbar("Please complete your card payment below", {
          variant: "error",
        });
        return;
      }
      // Prepare order data according to API specification
      const orderData = {
        items: checkout.items.map((item) => ({
          product: item.id,
          variation: item.colors?.[0] || null, // Assuming first color as variation
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName:
            checkout.billing?.firstName ||
            checkout.billing?.name?.split(" ")[0] ||
            "",
          lastName:
            checkout.billing?.lastName ||
            checkout.billing?.name?.split(" ").slice(1).join(" ") ||
            "",
          address1: checkout.billing?.fullAddress || "",
          city: checkout.billing?.city || "",
          state: checkout.billing?.state || "",
          postcode: checkout.billing?.postcode || "",
          country: checkout.billing?.country || "",
          email: checkout.billing?.email || "",
          phone: checkout.billing?.phoneNumber || "",
        },
        billingAddress: {
          firstName:
            checkout.billing?.firstName ||
            checkout.billing?.name?.split(" ")[0] ||
            "",
          lastName:
            checkout.billing?.lastName ||
            checkout.billing?.name?.split(" ").slice(1).join(" ") ||
            "",
          address1: checkout.billing?.fullAddress || "",
          city: checkout.billing?.city || "",
          state: checkout.billing?.state || "",
          postcode: checkout.billing?.postcode || "",
          country: checkout.billing?.country || "",
          email: checkout.billing?.email || "",
          phone: checkout.billing?.phoneNumber || "",
        },
        shippingMethod: data.delivery || "689d373f5099e06126e689ca",
        paymentMethod: data.payment || "cash",
        couponCode: checkout.discount > 0 ? "DISCOUNT10" : undefined,
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      // Debug: Log the order response to see its structure

      setOrder(order);

      // Handle different possible order number field names
      const orderNumber =
        order.order?.orderNumber ||
        order.order?.order_number ||
        order.order?.id ||
        order.order._id ||
        "Unknown";

      // Prepare customer data for email
      const customer = {
        name: checkout.billing?.firstName && checkout.billing?.lastName 
          ? `${checkout.billing.firstName} ${checkout.billing.lastName}`
          : checkout.billing?.name || "Customer",
        email: checkout.billing?.email || order.shippingAddress?.email
      };

      // Send emails after successful order creation
      try {
        const emailResults = await sendOrderEmailsMutation.mutateAsync({
          order: order.order || order,
          customer
        });

        // Check if emails were sent successfully
        const hasErrors = emailResults.errors && emailResults.errors.length > 0;
        const hasSuccess = emailResults.confirmation || emailResults.adminNotification;

        if (hasSuccess && !hasErrors) {
          enqueueSnackbar(
            `Order #${orderNumber} created successfully! Confirmation and admin notification emails sent.`,
            { variant: "success" }
          );
        } else if (hasSuccess && hasErrors) {
          enqueueSnackbar(
            `Order #${orderNumber} created successfully! Some emails may not have been sent.`,
            { variant: "warning" }
          );
        } else {
          enqueueSnackbar(
            `Order #${orderNumber} created successfully! Email notifications failed.`,
            { variant: "warning" }
          );
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        enqueueSnackbar(
          `Order #${orderNumber} created successfully! Check your email for confirmation.`,
          { variant: "success" }
        );
      }

      try {
        // Clear checkout state completely to empty the cart
        checkout.onClearState();

        router.push(paths.product.orderSuccess);
      } catch (navigationError) {
        console.error("Navigation error:", navigationError);

        enqueueSnackbar(
          "Order placed successfully! Check your email for confirmation.",
          {
            variant: "warning",
          }
        );
      }
    } catch (error) {
      console.error("Order creation failed:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        enqueueSnackbar("Invalid order data. Please check your information.", {
          variant: "error",
        });
      } else if (error.response?.status === 401) {
        enqueueSnackbar("Please login to create an order.", {
          variant: "error",
        });
      } else if (error.response?.status === 422) {
        enqueueSnackbar(
          "Order validation failed. Please check your information.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar(
          error.message || "Failed to create order. Please try again.",
          { variant: "error" }
        );
      }
    }
  });

  const handleStripePaymentSuccess = async (paymentIntent) => {
    // Prevent duplicate processing
    if (stripePaymentIntent && stripePaymentIntent.id === paymentIntent.id) {
      enqueueSnackbar("Payment already processed", { variant: "warning" });
      return;
    }

    setStripePaymentIntent(paymentIntent);
    setIsProcessingStripe(true);
    setPaymentAttempts(prev => prev + 1);
    
    enqueueSnackbar("Payment successful! Creating your order...", {
      variant: "success",
    });

    // Automatically submit the order after successful payment
    try {
      await createOrderWithStripePayment(paymentIntent);
    } catch (error) {
      setIsProcessingStripe(false);
      enqueueSnackbar(
        `Payment successful but order creation failed: ${error.message}. Please contact support with payment ID: ${paymentIntent.id}`, 
        { variant: "error" }
      );
      throw error; // Re-throw to let the form know there was an error
    }
  };

  const handleStripePaymentError = (error) => {
    setIsProcessingStripe(false);
    setPaymentAttempts(prev => prev + 1);
    
    // Only allow 1 attempt
    if (paymentAttempts >= 1) {
      enqueueSnackbar("Payment failed. Please refresh the page and try again.", {
        variant: "error",
      });
      return;
    }
    
    enqueueSnackbar(error.message || "Payment failed. Please try again.", {
      variant: "error",
    });
  };

  // Memoize metadata to prevent unnecessary payment intent recreations
  // Only update when checkout values that matter for payment actually change
  const stripeMetadata = useMemo(() => {
    const customerName = checkout.billing?.name || 
      `${checkout.billing?.firstName || ''} ${checkout.billing?.lastName || ''}`.trim();
    
    return {
      customerName,
      customerEmail: checkout.billing?.email || '',
      items: JSON.stringify(checkout.items?.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })) || []),
      subtotal: String(checkout.subTotal || 0),
      shipping: String(checkout.shipping || 0),
      discount: String(checkout.discount || 0),
      // Use total as part of orderId to ensure it's stable for same total
      orderId: `order_${checkout.total}_${checkout.items?.length || 0}`,
    };
  }, [
    checkout.billing?.name,
    checkout.billing?.firstName,
    checkout.billing?.lastName,
    checkout.billing?.email,
    checkout.items,
    checkout.subTotal,
    checkout.shipping,
    checkout.discount,
    checkout.total,
  ]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery
            onApplyShipping={checkout.onApplyShipping}
            options={DELIVERY_OPTIONS}
            disabled={true}
            selectedOption={DELIVERY_OPTIONS[0]}
          />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          {/* Show Stripe payment form when Stripe is selected */}
          {selectedPayment === "stripe" && (
            <Card sx={{ my: 3 }}>
              <CardHeader title="Card Payment" />
              <CardContent>
                <StripePaymentWrapper
                  amount={checkout.total}
                  currency="pkr"
                  metadata={stripeMetadata}
                  onSuccess={handleStripePaymentSuccess}
                  onError={handleStripePaymentError}
                />
              </CardContent>
            </Card>
          )}

          <Button
            size="small"
            color="inherit"
            sx={{ color: "white" }}
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo
            billing={checkout.billing}
            onBackStep={checkout.onBackStep}
          />

          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping }
            onEdit={() => checkout.onGotoStep(0)}
          />

          {selectedPayment !== "stripe" && (
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
              loading={isSubmitting || createOrderMutation.isPending}
              disabled={isSubmitting || createOrderMutation.isPending}>
              {createOrderMutation.isPending
                ? "Creating Order..."
                : "Complete Order"}
            </LoadingButton>
          )}

          {selectedPayment === "stripe" && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Complete payment to place your order
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
