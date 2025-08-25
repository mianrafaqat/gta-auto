"use client";

import { CategoryEditView } from "src/sections/admin/categories/view";

// ----------------------------------------------------------------------

export default function CategoryEditPage({ params }) {
  return <CategoryEditView categoryId={params.id} />;
}
