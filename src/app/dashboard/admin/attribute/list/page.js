"use client";

import { RoleBasedGuard } from "src/auth/guard";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import Container from "@mui/material/Container";
import { useSettingsContext } from "src/components/settings";
import { AttributeListView } from "src/sections/admin/attribute/view";

// ----------------------------------------------------------------------

export default function AdminAttributeListPage() {
  const settings = useSettingsContext();

  return (
    <RoleBasedGuard roles={["admin"]}>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="All Attributes"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Admin", href: paths.dashboard.admin.root },
            // { name: "Categories", href: paths.dashboard.admin.categories.list },
            { name: "List" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AttributeListView />
      </Container>
    </RoleBasedGuard>
  );
}
