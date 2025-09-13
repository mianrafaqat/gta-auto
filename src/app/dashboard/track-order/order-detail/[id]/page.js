"use client";
import React from "react";
import OrderDetail from "src/sections/track-order/order-detail";
import { useParams } from "next/navigation";

const OrderDetailPage = () => {
  const { id } = useParams();
  return <OrderDetail id={id} />;
};

export default OrderDetailPage;
