"use client";

import { useState, useCallback } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { RoleBasedGuard } from "src/auth/guard";
import AddCouponListView from "src/sections/coupons/add/add-coupon-list-view";

// ----------------------------------------------------------------------

export default function AddCouponPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={["user", "admin"]}>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Add Coupon"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Admin", href: paths.dashboard.admin.root },
            // { name: "Coupons", href: paths.dashboard.admin.coupon.list },
            { name: "Add New Coupon" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AddCouponListView />
      </Container>
    </RoleBasedGuard>
  );
}
