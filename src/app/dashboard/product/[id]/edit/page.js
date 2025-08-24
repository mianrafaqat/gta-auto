"use client";

import { ProductEditView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export default function ProductEditPage({ params }) {
  return <ProductEditView productId={params.id} />;
}
