"use client";

import { useState, useCallback } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { RoleBasedGuard } from "src/auth/guard";

import AddTaxListView from "src/sections/tax/add/add-tax-list-view";

// ----------------------------------------------------------------------

export default function AddTaxPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={["user", "admin"]}>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Add Tax"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Tax", href: paths.dashboard.tax.root },
            { name: "Add New Tax" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AddTaxListView />
      </Container>
    </RoleBasedGuard>
  );
}
