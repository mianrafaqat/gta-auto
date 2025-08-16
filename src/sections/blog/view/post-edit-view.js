"use client";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import BlogService from "src/services/blog/blog.service";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import PostNewEditForm from "../post-new-edit-form";

// ----------------------------------------------------------------------

export default function PostEditView({ title }) {
  const settings = useSettingsContext();
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🔍 PostEditView - Component rendered with title:", title);

  // Decode the title from URL if it's encoded
  const decodedTitle = decodeURIComponent(title);
  console.log("🔍 PostEditView - Original title:", title);
  console.log("🔍 PostEditView - Decoded title:", decodedTitle);

  // Fetch post data
  useEffect(() => {
    console.log("🔍 PostEditView - useEffect triggered with title:", title);

    const fetchPost = async () => {
      try {
        console.log("🔍 PostEditView - Starting fetchPost function");
        setLoading(true);
        setError(null);

        // First, get all posts to find the one with matching title
        console.log(
          "🔍 PostEditView - Starting fetch for title:",
          decodedTitle
        );
        console.log("🔍 PostEditView - About to call BlogService.getAll()");
        const allPostsResponse = await BlogService.getAll();
        console.log("🔍 PostEditView - BlogService.getAll() completed");
        console.log("🔍 PostEditView - All posts response:", allPostsResponse);

        const allPosts = allPostsResponse?.data?.data || [];
        console.log("🔍 PostEditView - All posts array:", allPosts);
        console.log(
          "🔍 PostEditView - Available titles:",
          allPosts.map((p) => p.title)
        );

        if (allPosts.length === 0) {
          setError("No posts found in the system. Please create a post first.");
          return;
        }

        // Find the post with matching title (try multiple matching strategies)
        const post =
          // 1. Exact match with decoded title
          allPosts.find((p) => p.title === decodedTitle) ||
          // 2. Exact match with original title
          allPosts.find((p) => p.title === title) ||
          // 3. Case insensitive match
          allPosts.find(
            (p) => p.title.toLowerCase() === decodedTitle.toLowerCase()
          ) ||
          // 4. Match by converting hyphens to spaces and vice versa
          allPosts.find((p) => p.title === decodedTitle.replace(/-/g, " ")) ||
          allPosts.find((p) => p.title === decodedTitle.replace(/\s+/g, "-")) ||
          // 5. Match by converting spaces to hyphens
          allPosts.find((p) => p.title.replace(/\s+/g, "-") === decodedTitle) ||
          // 6. Match by converting hyphens to spaces
          allPosts.find((p) => p.title.replace(/-/g, " ") === decodedTitle);

        console.log("🔍 PostEditView - Found post:", post);
        console.log("🔍 PostEditView - Title comparison:", {
          searchingFor: decodedTitle,
          originalTitle: title,
          availableTitles: allPosts.map((p) => p.title),
          exactMatch: allPosts.find((p) => p.title === decodedTitle),
          originalMatch: allPosts.find((p) => p.title === title),
          caseInsensitiveMatch: allPosts.find(
            (p) => p.title.toLowerCase() === decodedTitle.toLowerCase()
          ),
          hyphenToSpaceMatch: allPosts.find(
            (p) => p.title === decodedTitle.replace(/-/g, " ")
          ),
          spaceToHyphenMatch: allPosts.find(
            (p) => p.title.replace(/\s+/g, "-") === decodedTitle
          ),
        });

        if (!post) {
          setError(
            `Post not found. Searching for: "${decodedTitle}". Available titles: ${allPosts.map((p) => p.title).join(", ")}`
          );
          return;
        }

        // Now get the specific post by ID
        const postResponse = await BlogService.getById(post._id);
        const postData = postResponse?.data?.data;

        console.log("📄 Post data structure check:", {
          hasData: !!postData,
          dataType: typeof postData,
          isObject: postData && typeof postData === "object",
          keys: postData ? Object.keys(postData) : [],
          idFields: postData
            ? {
                _id: postData._id,
                id: postData.id,
                blogID: postData.blogID,
              }
            : null,
        });

        if (postData) {
          console.log("🔍 PostEditView - Fetched post data:", postData);
          console.log("🔍 PostEditView - Post ID fields:", {
            _id: postData._id,
            id: postData.id,
            blogID: postData.blogID,
          });
          setCurrentPost(postData);
        } else {
          setError("Failed to load post details");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (decodedTitle) {
      fetchPost();
    }
  }, [decodedTitle]);

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Loading...</h2>
          <p>Please wait while we load the post data.</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Error Loading Post</h2>
          <p>{error}</p>
          <p>Title: {title}</p>
        </div>
      </Container>
    );
  }

  if (!currentPost) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Post Not Found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <p>Title: {title}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
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
            name: currentPost?.title,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PostNewEditForm currentPost={currentPost} />
    </Container>
  );
}

PostEditView.propTypes = {
  title: PropTypes.string,
};
