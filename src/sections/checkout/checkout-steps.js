import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Step from "@mui/material/Step";

import { useCheckoutContext } from "./context/checkout-context";
import CheckoutCart from "./checkout-cart";
import CheckoutBilling from "./checkout-billing";
import CheckoutPayment from "./checkout-payment";

// ----------------------------------------------------------------------

const STEPS = ["Cart", "Billing & address", "Payment"];

export default function CheckoutSteps() {
  const {
    checkout,
    onNextStep: onNext,
    onBackStep: onBack,
  } = useCheckoutContext();
  const [activeStep, setActiveStep] = useState(1); // Start at billing step

  const handleNextStep = () => {
    onNext();
    setActiveStep(activeStep + 1);
  };

  const handleBackStep = () => {
    onBack();
    setActiveStep(activeStep - 1);
  };

  const handleGotoStep = (step) => {
    setActiveStep(step);
  };

  const renderContent = () => {
    if (activeStep === 1) {
      return <CheckoutBilling onSubmit={handleNextStep} />;
    }

    if (activeStep === 2) {
      return <CheckoutPayment onBackStep={handleBackStep} />;
    }

    return <CheckoutCart onNextStep={handleNextStep} />;
  };

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        sx={{
          mb: 5,
          "& .MuiStepLabel-label": {
            typography: "subtitle2",
          },
        }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderContent()}
    </>
  );
}

// ----------------------------------------------------------------------

CheckoutSteps.propTypes = {
  checkout: PropTypes.object,
};
