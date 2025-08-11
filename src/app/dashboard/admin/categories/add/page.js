"use client";

import { useState, useCallback } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { RoleBasedGuard } from "src/auth/guard";

import VideoAddView from "src/sections/video/view/video-add-view";
import AddCategoriesListView from "src/sections/categories/add/add-categories-list-view";
import AddAttributeListView from "src/sections/attribute/add/add-attribute-list-view";

// ----------------------------------------------------------------------

export default function VideoAddPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={["user", "admin"]}>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Add Category"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Video", href: paths.dashboard.video.root },
            { name: "Add New Category" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AddCategoriesListView />
      </Container>
    </RoleBasedGuard>
  );
}
