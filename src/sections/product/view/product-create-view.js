"use client";

import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import ProductNewEditForm from "../product-new-edit-form";

// ----------------------------------------------------------------------

export default function ProductCreateView({
  isEdit,
  currentProduct,
  onSubmit,
}) {
  const settings = useSettingsContext();

  // Safety check for settings context
  if (!settings) {
    return (
      <Container maxWidth="lg">
        <div>Loading settings...</div>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading={isEdit ? "Edit product" : "Create a new product"}
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Product",
            href: paths.dashboard.product.root,
          },
          { name: isEdit ? "Edit product" : "New product" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm
        isEdit={isEdit}
        currentProduct={currentProduct}
        onSubmit={onSubmit}
      />
    </Container>
  );
}
