import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import { useCheckoutContext } from "./context";
import CheckoutSummary from "./checkout-summary";
import CheckoutDelivery from "./checkout-delivery";
import CheckoutBillingInfo from "./checkout-billing-info";
import CheckoutPaymentMethods from "./checkout-payment-methods";
import { useCreateOrder } from "src/hooks/use-orders";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import OrderSuccess from "./order-success";
import { useState } from "react";

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    id: "689d373f5099e06126e689ca",
    value: 1800,
    label: "Standard Delivery",
    description: "3-5 Business Days",
  },
  {
    id: "689d373f5099e06126e689cd",
    value: 3600,
    label: "Express Delivery",
    description: "1-2 Business Days",
  },
  {
    id: "689d373f5099e06126e689d0",
    value: 7200,
    label: "Premium Delivery",
    description: "Same Day (Limited Areas)",
  },
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
  const [order, setOrder] = useState(null);
  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Payment is required"),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: "",
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
      //       console.log("data", data);
      //       console.log(orderData);
      //  return;
      // Create the order
      const order = await createOrderMutation.mutateAsync(orderData);
      setOrder(order);
      enqueueSnackbar("Order created successfully!", { variant: "success" });

      try {
        // Reset checkout first
        // checkout.onNextStep();
        // checkout.onReset();

        router.push(paths.product.orderSuccess);
      } catch (navigationError) {
        console.error("Navigation error:", navigationError);
        // Even if navigation fails, the order was still created successfully
        enqueueSnackbar(
          "Order placed successfully, but there was an error navigating to the success page",
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery
            onApplyShipping={checkout.onApplyShipping}
            options={DELIVERY_OPTIONS}
          />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

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
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting || createOrderMutation.isPending}
            disabled={isSubmitting || createOrderMutation.isPending}>
            {createOrderMutation.isPending
              ? "Creating Order..."
              : "Complete Order"}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
