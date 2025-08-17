import dynamic from "next/dynamic";
import React from "react";
import Loading from "src/app/loading";
import { RoleBasedGuard } from "src/auth/guard";

const ForumCategoryList = dynamic(
  () => import("src/components/admin/forum/category-list"),
  {
    loading: () => <Loading />,
  }
);

export default function ForumCategoriesPage() {
  return (
    <RoleBasedGuard roles={["admin"]}>
      <ForumCategoryList />
    </RoleBasedGuard>
  );
}
