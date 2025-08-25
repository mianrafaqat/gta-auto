"use client";

import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

// Services
import BlogService from "src/services/blog/blog.service";

// Components
import {
  BlogHeader,
  BlogGrid,
  BlogLoadMore,
  BlogEmptyState,
  BlogErrorState,
  BlogLoadingState,
} from "./components";

// ----------------------------------------------------------------------

const Blog = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await BlogService.getAll();
        const allPosts = response?.data?.data || [];
        setPosts(allPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleViewDetails = (post) => {
    // Navigate to blog detail page
    const titleSlug = post.title.toLowerCase().replace(/\s+/g, "-");
    router.push(paths.blog.details(titleSlug));
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination logic
    console.log("Load more posts");
  };

  if (loading) {
    return <BlogLoadingState />;
  }

  if (error) {
    return <BlogErrorState error={error} />;
  }

  if (posts.length === 0) {
    return <BlogEmptyState />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8, mt: "40px" }}>
      <BlogHeader />

      <BlogGrid posts={posts} onViewDetails={handleViewDetails} />

      {posts.length >= 6 && <BlogLoadMore onLoadMore={handleLoadMore} />}
    </Container>
  );
};

export default Blog;
