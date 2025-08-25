"use client";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";

import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import EmptyContent from "src/components/empty-content";

import PostDetailsHero from "../post-details-hero";
import BlogCommentList from "../blog-comment-list";
import PostCommentForm from "../post-comment-form";
import { PostDetailsSkeleton } from "../post-skeleton";

import { useGetBlogById, useGetBlogs } from "src/hooks/use-blogs";
import { UserService } from "src/services";

// ----------------------------------------------------------------------

export default function PublicPostDetailsView({ post }) {
  const commentListRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        const userData = response?.data || response;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);
  // Determine if we need to search by title or use direct ID
  const isTitleSearch = typeof post === "string";

  // Fetch all blogs if we need to search by title
  const {
    data: allBlogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useGetBlogs();

  // Helper function to create URL-friendly slug
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Find the blog with matching title/slug
  const foundBlog = isTitleSearch
    ? allBlogs?.find((blog) => {
        const blogSlug = createSlug(blog.title);
        const searchSlug = post.toLowerCase();
        return blogSlug === searchSlug;
      })
    : null;

  // Use the found blog's ID or the direct post ID
  const postId = isTitleSearch ? foundBlog?._id : post?._id;

  // Fetch the specific blog details
  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
  } = useGetBlogById(postId);

  const renderError = (
    <EmptyContent
      filled
      title="Post not found"
      description="The post you're looking for doesn't exist or has been removed."
      action={
        <Button
          component={RouterLink}
          href={paths.blog.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}>
          Back to Blog
        </Button>
      }
      sx={{
        py: 20,
      }}
    />
  );

  // Show loading skeleton while fetching blogs or post
  if (blogsLoading || postLoading) {
    return <PostDetailsSkeleton />;
  }

  // Show error if blogs failed to load or post not found
  if (blogsError || postError || !postData) {
    return renderError;
  }

  // If searching by title and no blog found, show error
  if (isTitleSearch && !foundBlog) {
    return renderError;
  }

  const renderPost = (
    <>
      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ mb: 3, mt: "80px" }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ py: 2, color: "#fff", mt: "42px" }}>
          <Link
            component={RouterLink}
            href={paths.blog.root}
            color="inherit"
            underline="hover">
            Blog
          </Link>
          <Typography color="#fff">{postData.title}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero Section */}
      <PostDetailsHero
        title={postData.title}
        coverUrl={postData.coverUrl}
        author={postData.author}
        createdAt={postData.createdAt}
        description={postData.description}
      />

      {/* Content */}
      <Stack
        sx={{
          maxWidth: 720,
          mx: "auto",
          mt: { xs: 5, md: 10 },
        }}>
        {/* Author and Date */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body2" color="#fff">
            By {postData.author?.name || "Anonymous"}
          </Typography>
          <Typography variant="body2" color="#fff">
            {fDate(postData.createdAt)}
          </Typography>
        </Stack>

        {/* Description */}
        <Typography variant="subtitle1" sx={{ mb: 5, color: "#fff" }}>
          {postData.description}
        </Typography>

        {/* Content */}
        <Markdown
          children={postData.content}
          sx={{ color: "#fff", paddingBottom: "32px" }}
        />

        {/* Tags */}
        {postData.tags && postData.tags.length > 0 && (
          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: `solid 1px #fff`,
            }}>
            <Typography variant="subtitle2" color="#fff">
              Tags
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {postData.tags?.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Stack>
          </Stack>
        )}

        {/* Comments */}
        {postData.enableComments && (
          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `solid 1px #fff`,
            }}>
            <Typography variant="subtitle2" color="#fff">
              Comments
            </Typography>

            <BlogCommentList
              ref={commentListRef}
              postId={postData._id}
              currentUser={currentUser}
              isLoading={userLoading}
            />

            {!userLoading && (
              <PostCommentForm
                postId={postData._id}
                currentUser={currentUser}
                onCommentPosted={() => {
                  // Refresh comments when a new comment is posted
                  if (commentListRef.current?.fetchComments) {
                    commentListRef.current.fetchComments();
                  }
                }}
              />
            )}
          </Stack>
        )}
      </Stack>
    </>
  );

  return (
    <>
      <Container maxWidth={false}>{renderPost}</Container>
    </>
  );
}

PublicPostDetailsView.propTypes = {
  post: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
