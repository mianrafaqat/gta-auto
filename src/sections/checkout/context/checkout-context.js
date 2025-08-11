"use client";

import { createContext, useContext } from "react";

// ----------------------------------------------------------------------

export const CheckoutContext = createContext(null);

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckoutContext must be used within CheckoutProvider");
  }

  return context;
}
