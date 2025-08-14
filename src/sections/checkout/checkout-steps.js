import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { useCheckoutContext } from "./context/checkout-context";
import CheckoutCart from "./checkout-cart";
import CheckoutBilling from "./checkout-billing";
import CheckoutPayment from "./checkout-payment";
import OrderSuccess from "./order-success";

// ----------------------------------------------------------------------

const STEPS = ["Cart", "Billing & address", "Payment", "Success"];

export default function CheckoutSteps() {
  const {
    checkout,
    onNextStep: onNext,
    onBackStep: onBack,
    onCreateBilling,
    onGotoStep,
    onOrderSuccess,
  } = useCheckoutContext();

  // Use checkout.activeStep instead of local state
  const activeStep = checkout.activeStep;

  // Check if there are items in the cart
  const hasItems = checkout.items && checkout.items.length > 0;

  const handleNextStep = () => {
    console.log("Moving to next step from:", activeStep);
    onNext();
  };

  const handleBackStep = () => {
    console.log("Moving to previous step from:", activeStep);
    onBack();
  };

  const handleGotoStep = (step) => {
    console.log("Moving to step:", step);
    // Use the context's onGotoStep function
    onGotoStep(step);
  };

  const handleBillingSubmit = (data) => {
    console.log("Billing form submitted:", data);
    // Convert billing form data to the expected format
    const billingData = {
      name: `${data.shippingFirstName} ${data.shippingLastName}`,
      email: data.shippingEmail,
      phoneNumber: data.shippingPhone,
      fullAddress: `${data.shippingAddress1}, ${data.shippingCity}, ${data.shippingState}, ${data.shippingCountry}, ${data.shippingPostcode}`,
      address: data.shippingAddress1,
      city: data.shippingCity,
      state: data.shippingState,
      country: data.shippingCountry,
      zipCode: data.shippingPostcode,
    };

    // Save billing data to checkout context
    onCreateBilling(billingData);

    // Proceed to next step
    handleNextStep();
  };

  const handleOrderSuccess = (orderData) => {
    console.log("Order success handler called:", orderData);
    // Store order data in context
    onOrderSuccess(orderData);
    // Navigate to success step
    onGotoStep(3); // Success step
  };

  const renderContent = () => {
    console.log("Rendering content for step:", activeStep);

    // If no items in cart, show cart step
    if (!hasItems) {
      console.log("No items in cart, showing cart step");
      return <CheckoutCart onNextStep={handleNextStep} />;
    }

    if (activeStep === 0) {
      console.log("Showing cart step");
      return <CheckoutCart onNextStep={handleNextStep} />;
    }

    if (activeStep === 1) {
      console.log("Showing billing step");
      return <CheckoutBilling onSubmit={handleBillingSubmit} />;
    }

    if (activeStep === 2) {
      console.log("Showing payment step");
      return (
        <CheckoutPayment
          onBackStep={handleBackStep}
          onOrderSuccess={handleOrderSuccess}
        />
      );
    }

    if (activeStep === 3) {
      console.log("Showing success step");
      return <OrderSuccess order={checkout.lastOrder} />;
    }

    console.log("Default case, showing cart step");
    return <CheckoutCart onNextStep={handleNextStep} />;
  };
}

CheckoutSteps.propTypes = {
  activeStep: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

function StepIcon({ active, completed }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 24,
        height: 24,
        color: 'text.disabled',
        ...(active && {
          color: 'primary.main',
        }),
      }}
    >
      {completed ? (
        <Iconify icon="eva:checkmark-fill" sx={{ color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Stack>
  );
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};
