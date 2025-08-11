"use client";

import { useSearchParams } from "next/navigation";

import OrderSuccess from "src/sections/checkout/order-success";

// ----------------------------------------------------------------------

export default function CheckoutOrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderDetails = searchParams.get("order")
    ? JSON.parse(searchParams.get("order"))
    : null;

  return <OrderSuccess order={orderDetails} />;
}
