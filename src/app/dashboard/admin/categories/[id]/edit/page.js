"use client";

import React from "react";
import AddCategoriesListView from "src/sections/categories/add/add-categories-list-view";

export default function VideoEditPage({ params }) {
  return <AddCategoriesListView isEdit videoId={params.id} />;
}
