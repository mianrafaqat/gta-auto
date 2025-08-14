<<<<<<< Updated upstream
<<<<<<< Updated upstream
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
=======
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
>>>>>>> Stashed changes

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

<<<<<<< Updated upstream
import { useCheckoutContext } from "./context/checkout-context";
import { useCreateOrder } from "src/hooks/use-orders";
import FormProvider from "src/components/hook-form/form-provider";
import RHFTextField from "src/components/hook-form/rhf-text-field";
import ShippingService from "src/services/shipping/shipping.service";
=======
=======
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

>>>>>>> Stashed changes
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutDelivery from './checkout-delivery';
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';
import { useCreateOrder } from 'src/hooks/use-orders';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    id: '689d373f5099e06126e689ca',
    value: 1800,
    label: 'Standard Delivery',
    description: '3-5 Business Days',
  },
  {
    id: '689d373f5099e06126e689cd',
    value: 3600,
    label: 'Express Delivery',
    description: '1-2 Business Days',
  },
  {
    id: '689d373f5099e06126e689d0',
    value: 7200,
    label: 'Premium Delivery',
    description: 'Same Day (Limited Areas)',
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
    value: 'cash',
    label: 'Cash',
    description: 'Pay with cash when your order is delivered.',
  },
];

<<<<<<< Updated upstream
<<<<<<< Updated upstream
export default function CheckoutPayment({ onBackStep, onOrderSuccess }) {
=======
=======
>>>>>>> Stashed changes
const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
<<<<<<< Updated upstream
>>>>>>> Stashed changes
  const router = useRouter();
  const createOrderMutation = useCreateOrder();

<<<<<<< Updated upstream
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(true);

  const createOrder = useCreateOrder();

  // Check if billing information is completed
  useEffect(() => {
    console.log("Checkout billing data:", checkout.billing);
    if (!checkout.billing) {
      setErrorMsg(
        "Please complete billing information first before proceeding to payment."
      );
    } else {
      setErrorMsg(""); // Clear error when billing is available
    }
  }, [checkout.billing]);

  const CheckoutSchema = Yup.object().shape({
    paymentMethod: Yup.string().required("Payment method is required"),
    shippingMethod: Yup.string().required("Shipping method is required"),
    couponCode: Yup.string(),
  });

  const defaultValues = {
    paymentMethod: "card",
    shippingMethod: "",
    couponCode: "",
=======
  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
>>>>>>> Stashed changes
=======
  const router = useRouter();
  const createOrderMutation = useCreateOrder();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
>>>>>>> Stashed changes
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const { handleSubmit, watch, setValue } = methods;
  const selectedShippingMethod = watch("shippingMethod");
  const selectedPaymentMethod = watch("paymentMethod");

  console.log("Current form values:", {
    paymentMethod: selectedPaymentMethod,
    shippingMethod: selectedShippingMethod,
  });

  // Fetch shipping methods on component mount
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoadingShipping(true);
        const response = await ShippingService.getAllMethods();
        setShippingMethods(response.data || response || []);

        // Set default shipping method if available
        if (response.data?.length > 0 || response?.length > 0) {
          const methods = response.data || response;
          setValue("shippingMethod", methods[0]._id || methods[0].id);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setErrorMsg("Failed to load shipping methods");
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingMethods();
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg("");
    setSubmitting(true);

    console.log("Form data being submitted:", data);
    console.log("Selected payment method:", data.paymentMethod);
    console.log("Selected shipping method:", data.shippingMethod);

    try {
      if (!data.shippingMethod) {
        setErrorMsg("Please select a shipping method");
=======
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validate required data
      if (!checkout.items || checkout.items.length === 0) {
        enqueueSnackbar('No items in cart', { variant: 'error' });
>>>>>>> Stashed changes
=======
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validate required data
      if (!checkout.items || checkout.items.length === 0) {
        enqueueSnackbar('No items in cart', { variant: 'error' });
>>>>>>> Stashed changes
        return;
      }

      if (!checkout.billing) {
        enqueueSnackbar('Please provide billing information', { variant: 'error' });
<<<<<<< Updated upstream
        return;
      }
<<<<<<< Updated upstream

      // Check if billing information is available
      if (!checkout.billing) {
        setErrorMsg("Please complete billing information first");
        return;
      }

      // Get the selected shipping method details
      const selectedMethod = shippingMethods.find(
        (method) =>
          method._id === data.shippingMethod ||
          method.id === data.shippingMethod
      );

      // Prepare order data with actual user information
=======
      // Prepare order data according to API specification
>>>>>>> Stashed changes
=======
        return;
      }
      // Prepare order data according to API specification
>>>>>>> Stashed changes
      const orderData = {
        items: checkout.items.map(item => ({
          product: item.id,
          variation: item.colors?.[0] || null, // Assuming first color as variation
          quantity: item.quantity
        })),
        shippingAddress: {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          firstName: checkout.billing.name?.split(" ")[0] || "",
          lastName: checkout.billing.name?.split(" ").slice(1).join(" ") || "",
          address1: checkout.billing.fullAddress || "",
          city: checkout.billing.city || "",
          state: checkout.billing.state || "",
          postcode: checkout.billing.zipCode || "",
          country: checkout.billing.country || "",
          email: checkout.billing.email || "",
          phone: checkout.billing.phoneNumber || "",
        },
        billingAddress: {
          firstName: checkout.billing.name?.split(" ")[0] || "",
          lastName: checkout.billing.name?.split(" ").slice(1).join(" ") || "",
          address1: checkout.billing.fullAddress || "",
          city: checkout.billing.city || "",
          state: checkout.billing.state || "",
          postcode: checkout.billing.zipCode || "",
          country: checkout.billing.country || "",
          email: checkout.billing.email || "",
          phone: checkout.billing.phoneNumber || "",
        },
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode || null,
        total: checkout.total,
        subTotal: checkout.subTotal,
        shipping: selectedMethod?.price || 0,
        discount: checkout.discount || 0,
      };

      const response = await createOrder.mutateAsync(orderData);

      console.log("Order creation response:", response);

      onReset();

      // Navigate to success page with order data
      const orderId =
        response.orderId ||
        response.id ||
        response._id ||
        response.order?.id ||
        response.order?._id;

      if (orderId) {
        const orderData = {
          orderNumber: orderId,
          createdAt: new Date().toISOString(),
          paymentMethod: data.paymentMethod,
          subTotal: checkout.subTotal,
          shippingCost: selectedMethod?.price || 0,
          total: checkout.total,
        };

        // Call the success handler instead of navigating directly
        if (onOrderSuccess) {
          onOrderSuccess(orderData);
        } else {
          // Fallback to direct navigation if no handler provided
          router.push({
            pathname: paths.product.checkout.orderSuccess,
            query: {
              order: JSON.stringify(orderData),
            },
          });
        }
      } else {
        // If no order ID, just go to success page
        if (onOrderSuccess) {
          onOrderSuccess({});
        } else {
          router.push(paths.product.checkout.orderSuccess);
        }
      }
=======
          firstName: checkout.billing?.firstName || checkout.billing?.name?.split(' ')[0] || '',
          lastName: checkout.billing?.lastName || checkout.billing?.name?.split(' ').slice(1).join(' ') || '',
          address1: checkout.billing?.fullAddress || '',
          city: checkout.billing?.city || '',
          state: checkout.billing?.state || '',
          postcode: checkout.billing?.postcode || '',
          country: checkout.billing?.country || '',
          email: checkout.billing?.email || '',
          phone: checkout.billing?.phoneNumber || ''
        },
        billingAddress: {
          firstName: checkout.billing?.firstName || checkout.billing?.name?.split(' ')[0] || '',
          lastName: checkout.billing?.lastName || checkout.billing?.name?.split(' ').slice(1).join(' ') || '',
          address1: checkout.billing?.fullAddress || '',
          city: checkout.billing?.city || '',
          state: checkout.billing?.state || '',
          postcode: checkout.billing?.postcode || '',
          country: checkout.billing?.country || '',
          email: checkout.billing?.email || '',
          phone: checkout.billing?.phoneNumber || ''
        },
        shippingMethod: data.delivery || '689d373f5099e06126e689ca',
        paymentMethod: data.payment || 'cash',
        couponCode: checkout.discount > 0 ? 'DISCOUNT10' : undefined
      };
=======
          firstName: checkout.billing?.firstName || checkout.billing?.name?.split(' ')[0] || '',
          lastName: checkout.billing?.lastName || checkout.billing?.name?.split(' ').slice(1).join(' ') || '',
          address1: checkout.billing?.fullAddress || '',
          city: checkout.billing?.city || '',
          state: checkout.billing?.state || '',
          postcode: checkout.billing?.postcode || '',
          country: checkout.billing?.country || '',
          email: checkout.billing?.email || '',
          phone: checkout.billing?.phoneNumber || ''
        },
        billingAddress: {
          firstName: checkout.billing?.firstName || checkout.billing?.name?.split(' ')[0] || '',
          lastName: checkout.billing?.lastName || checkout.billing?.name?.split(' ').slice(1).join(' ') || '',
          address1: checkout.billing?.fullAddress || '',
          city: checkout.billing?.city || '',
          state: checkout.billing?.state || '',
          postcode: checkout.billing?.postcode || '',
          country: checkout.billing?.country || '',
          email: checkout.billing?.email || '',
          phone: checkout.billing?.phoneNumber || ''
        },
        shippingMethod: data.delivery || '689d373f5099e06126e689ca',
        paymentMethod: data.payment || 'cash',
        couponCode: checkout.discount > 0 ? 'DISCOUNT10' : undefined
      };
>>>>>>> Stashed changes
//       console.log("data", data);
//       console.log(orderData);
//  return;
      // Create the order
      const order = await createOrderMutation.mutateAsync(orderData);
      
      enqueueSnackbar('Order created successfully!', { variant: 'success' });
      
      // Navigate to order confirmation or orders list
      router.push(paths.dashboard.orders.root);
      
      // Reset checkout and move to next step
      checkout.onNextStep();
      checkout.onReset();
      
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Order creation failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        enqueueSnackbar('Invalid order data. Please check your information.', { variant: 'error' });
      } else if (error.response?.status === 401) {
        enqueueSnackbar('Please login to create an order.', { variant: 'error' });
      } else if (error.response?.status === 422) {
        enqueueSnackbar('Order validation failed. Please check your information.', { variant: 'error' });
      } else {
        enqueueSnackbar(
          error.message || 'Failed to create order. Please try again.',
          { variant: 'error' }
        );
      }
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {errorMsg && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              !checkout.billing && onBackStep ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onBackStep}
                  sx={{ textTransform: "none" }}>
                  Go to Billing
                </Button>
              ) : null
            }>
            {errorMsg}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Select Payment Method</Typography>
          <RadioGroup
            name="paymentMethod"
            value={watch("paymentMethod")}
            onChange={(e) => setValue("paymentMethod", e.target.value)}>
            {PAYMENT_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </Stack>

        {/* Shipping Method Section */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Select Shipping Method</Typography>

          {loadingShipping ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : shippingMethods.length > 0 ? (
            <RadioGroup name="shippingMethod" value={selectedShippingMethod}>
              {shippingMethods.map((method) => (
                <FormControlLabel
                  key={method._id || method.id}
                  value={method._id || method.id}
                  control={<Radio />}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {method.name || method.title}
                        </Typography>
                        {method.description && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}>
                            {method.description}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#4caf50" }}>
                        ${method.price || method.cost || 0}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    width: "100%",
                    margin: 0,
                    padding: 2,
                    border: "1px solid",
                    borderColor:
                      selectedShippingMethod === (method._id || method.id)
                        ? "#4caf50"
                        : "divider",
                    borderRadius: 1,
                    "&:hover": {
                      borderColor: "#4caf50",
                      backgroundColor: "rgba(76, 175, 80, 0.04)",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          ) : (
            <Alert severity="warning">
              No shipping methods available. Please contact support.
            </Alert>
          )}
        </Stack>

        {/* Billing Information Summary */}
        {checkout.billing && (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Billing Information</Typography>
            <Card
              sx={{
                p: 2,
                backgroundColor: "rgba(76, 175, 80, 0.04)",
                border: "1px solid #4caf50",
              }}>
              <Stack spacing={1}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {checkout.billing.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {checkout.billing.fullAddress}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Phone: {checkout.billing.phoneNumber}
                </Typography>
                {checkout.billing.email && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Email: {checkout.billing.email}
                  </Typography>
                )}
              </Stack>
            </Card>
          </Stack>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Coupon Code</Typography>
          <RHFTextField
            name="couponCode"
            label="Enter coupon code (optional)"
=======
=======
>>>>>>> Stashed changes
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          />

          <Button
            size="small"
            color="inherit"
            sx={{ color: 'white' }}
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            loading={submitting}
            disabled={!checkout.billing}
            sx={{ flex: 1 }}>
            Place Order
=======
=======
>>>>>>> Stashed changes
            loading={isSubmitting || createOrderMutation.isPending}
            disabled={isSubmitting || createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Creating Order...' : 'Complete Order'}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
