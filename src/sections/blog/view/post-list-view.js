"use client";

import orderBy from "lodash/orderBy";
import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useDebounce } from "src/hooks/use-debounce";

import { POST_SORT_OPTIONS } from "src/_mock";
import { useGetPosts, useSearchPosts, useDeletePost } from "src/api/blog";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import PostSort from "../post-sort";
import PostSearch from "../post-search";
import PostListHorizontal from "../post-list-horizontal";

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: "all",
};

// ----------------------------------------------------------------------

export default function PostListView() {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState("latest");

  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  const { posts, postsLoading } = useGetPosts();

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const deletePostMutation = useDeletePost();

  // Ensure posts is always an array and add missing fields that UI expects
  const safePosts = Array.isArray(posts)
    ? posts.map((post) => ({
        ...post,
        // Add fields that UI expects but API doesn't provide
        totalViews: post.totalViews || 0,
        totalComments: post.totalComments || 0,
        totalShares: post.totalShares || 0,
        author: post.author || { name: "Admin", avatarUrl: "" },
      }))
    : [];

  console.log("Safe posts with defaults:", safePosts);

  const dataFiltered = applyFilter({
    inputData: safePosts,
    filters,
    sortBy,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters("publish", newValue);
    },
    [handleFilters]
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        console.log("Deleting post with ID:", postId);
        await deletePostMutation.mutateAsync(postId);
        // Success message will be handled by the mutation
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [deletePostMutation]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Blog",
            href: paths.dashboard.post.root,
          },
          {
            name: "List",
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}>
            New Post
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ flexShrink: 0 }}>
          <Label
            variant="soft"
            color={
              (filters.publish === "published" && "success") ||
              (filters.publish === "draft" && "warning") ||
              "default"
            }>
            {filters.publish === "all" && "All"}
            {filters.publish === "published" && "Published"}
            {filters.publish === "draft" && "Draft"}
          </Label>

          <Label variant="soft" color="info">
            {dataFiltered.length} posts
          </Label>
        </Stack>

        <Stack direction="row" spacing={1.5} flexShrink={0}>
          <PostSearch query={searchQuery} onSearch={handleSearch} />

          <PostSort
            sort={sortBy}
            onSort={handleSortBy}
            sortOptions={POST_SORT_OPTIONS}
          />
        </Stack>
      </Stack>

      <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          px: 2.5,
          boxShadow: (theme) => `inset 0 -1px 0 ${theme.palette.divider}`,
        }}>
        <Tab
          value="all"
          label={
            <>
              All
              <Label variant="soft" color="default" sx={{ ml: 1 }}>
                {safePosts.length}
              </Label>
            </>
          }
        />

        <Tab
          value="published"
          label={
            <>
              Published
              <Label variant="soft" color="success" sx={{ ml: 1 }}>
                {
                  safePosts.filter((post) => post.publish === "published")
                    .length
                }
              </Label>
            </>
          }
        />

        <Tab
          value="draft"
          label={
            <>
              Draft
              <Label variant="soft" color="warning" sx={{ ml: 1 }}>
                {safePosts.filter((post) => post.publish === "draft").length}
              </Label>
            </>
          }
        />
      </Tabs>

      <PostListHorizontal
        posts={dataFiltered}
        loading={postsLoading}
        onDeletePost={handleDeletePost}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const { publish } = filters;

  // Ensure inputData is an array
  if (!Array.isArray(inputData)) {
    return [];
  }

  console.log("Filtering posts:", inputData.length, "posts");
  console.log("Filter publish:", publish);

  if (sortBy === "latest") {
    inputData = orderBy(inputData, ["createdAt"], ["desc"]);
  }

  if (sortBy === "oldest") {
    inputData = orderBy(inputData, ["createdAt"], ["asc"]);
  }

  if (sortBy === "popular") {
    inputData = orderBy(inputData, ["totalViews"], ["desc"]);
  }

  if (publish !== "all") {
    inputData = inputData.filter((post) => post.publish === publish);
    console.log("After publish filter:", inputData.length, "posts");
  }

  return inputData;
}
