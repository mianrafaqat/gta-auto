"use client";

import { useState, useCallback } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { RoleBasedGuard } from "src/auth/guard";

import AddAttributeListView from "src/sections/attribute/add/add-attribute-list-view";

// ----------------------------------------------------------------------

export default function AttributeAddPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={["user", "admin"]}>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Add Attribute"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Attribute", href: paths.dashboard.attribute.root },
            { name: "Add New Attribute" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AddAttributeListView />
      </Container>
    </RoleBasedGuard>
  );
}
