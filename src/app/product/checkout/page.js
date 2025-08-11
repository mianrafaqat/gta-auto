"use client";

import { CheckoutProvider } from "src/sections/checkout/context/checkout-provider";
import { CheckoutView } from "src/sections/checkout";

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutView />
    </CheckoutProvider>
  );
}
