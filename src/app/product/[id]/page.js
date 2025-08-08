"use client";

import { useParams } from "next/navigation";

import ProductShopDetailsView from "src/sections/product/view/product-shop-details-view";

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id;

  return <ProductShopDetailsView id={id} />;
}
