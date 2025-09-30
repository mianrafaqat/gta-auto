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

  // Decode the title from URL if it's encoded
  const decodedTitle = decodeURIComponent(title);

  // Helper function to normalize text for comparison
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // Helper function to create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  };

  // Helper function to find post by title with multiple matching strategies
  const findPostByTitle = (posts, searchTitle) => {
    const strategies = [
      // 1. Exact match
      (p) => p.title === searchTitle,
      // 2. Case insensitive match
      (p) => p.title.toLowerCase() === searchTitle.toLowerCase(),
      // 3. Match by converting hyphens to spaces
      (p) => p.title === searchTitle.replace(/-/g, " "),
      // 4. Match by converting spaces to hyphens
      (p) => p.title.replace(/\s+/g, "-") === searchTitle,
      // 5. Match by converting title hyphens to spaces
      (p) => p.title.replace(/-/g, " ") === searchTitle,
      // 6. Case insensitive with hyphens to spaces
      (p) => p.title.toLowerCase() === searchTitle.replace(/-/g, " ").toLowerCase(),
      // 7. Normalized text comparison (removes punctuation)
      (p) => normalizeText(p.title) === normalizeText(searchTitle.replace(/-/g, " ")),
      // 8. Slug comparison
      (p) => createSlug(p.title) === searchTitle,
      // 9. Partial slug match (in case of truncation)
      (p) => createSlug(p.title).startsWith(searchTitle) || searchTitle.startsWith(createSlug(p.title)),
    ];

    for (const strategy of strategies) {
      const found = posts.find(strategy);
      if (found) return found;
    }
    return null;
  };

  // Get post ID with fallback options
  const getPostId = (post) => post._id || post.id || post.blogID;

  // Ensure post has proper ID fields for editing
  const normalizePostData = (postData, fallbackId) => {
    if (!postData._id && !postData.id && !postData.blogID) {
      return {
        ...postData,
        _id: fallbackId,
        id: fallbackId,
        blogID: fallbackId,
      };
    }
    return postData;
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!decodedTitle) return;

      try {
        setLoading(true);
        setError(null);

        // Get all posts to find the one with matching title
        const allPostsResponse = await BlogService.getAll();
        const allPosts = allPostsResponse?.data?.data || [];

        if (allPosts.length === 0) {
          setError("No posts found in the system. Please create a post first.");
          return;
        }

        // Find the post using multiple matching strategies
        const post = findPostByTitle(allPosts, decodedTitle) || findPostByTitle(allPosts, title);

        if (!post) {
          setError(
            `Post not found: "${decodedTitle}". Available posts: ${allPosts.map((p) => p.title).join(", ")}`
          );
          return;
        }

        // Get post ID
        const postId = getPostId(post);
        if (!postId) {
          setError(`Post found but has no valid ID. Available fields: ${Object.keys(post).join(", ")}`);
          return;
        }

        // Fetch detailed post data
        const postResponse = await BlogService.getById(postId);
        const postData = postResponse?.data?.data;

        if (postData) {
          const normalizedPost = normalizePostData(postData, postId);
          setCurrentPost(normalizedPost);
        } else {
          setError("Failed to load post details");
        }
      } catch (err) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [decodedTitle, title]);

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
