"use client";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import AvatarGroup, { avatarGroupClasses } from "@mui/material/AvatarGroup";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fShortenNumber } from "src/utils/format-number";

import { POST_PUBLISH_OPTIONS } from "src/_mock";

import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import EmptyContent from "src/components/empty-content";

import PostDetailsHero from "../post-details-hero";
import PostCommentList from "../post-comment-list";
import PostCommentForm from "../post-comment-form";
import { PostDetailsSkeleton } from "../post-skeleton";
import PostDetailsToolbar from "../post-details-toolbar";

import { useGetBlogById, useGetBlogs } from "src/hooks/use-blogs";

// ----------------------------------------------------------------------

export default function PostDetailsView({ post }) {
  const [publish, setPublish] = useState("");

  // Determine if we need to search by title or use direct ID
  const isTitleSearch = typeof post === "string";

  // Fetch all blogs if we need to search by title
  const {
    data: allBlogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useGetBlogs();

  // Find the blog with matching title if searching by title
  const foundBlog = isTitleSearch
    ? allBlogs?.find((blog) => blog.title === post)
    : null;

  // Use the found blog's ID or the direct post ID
  const postId = isTitleSearch ? foundBlog?._id : post?._id;

  // Fetch the specific blog details
  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
  } = useGetBlogById(postId);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  useEffect(() => {
    if (postData) {
      setPublish(postData?.publish);
    }
  }, [postData]);

  // const renderSkeleton = <PostDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title="Post not found"
      description="The post you're looking for doesn't exist or has been removed."
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.post.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}>
          Back to List
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
      <PostDetailsToolbar
        backLink={paths.dashboard.post.root}
        editLink={paths.dashboard.post.edit(`${postData?.title}`)}
        liveLink={paths.post.details(`${postData?.title}`)}
        publish={publish || ""}
        onChangePublish={handleChangePublish}
        publishOptions={POST_PUBLISH_OPTIONS}
      />

      <PostDetailsHero title={postData.title} coverUrl={postData.coverUrl} />

      <Stack
        sx={{
          maxWidth: 720,
          mx: "auto",
          mt: { xs: 5, md: 10 },
        }}>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {postData.description}
        </Typography>

        <Markdown children={postData.content} />

        <Stack
          spacing={3}
          sx={{
            py: 3,
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}>
          <Typography variant="subtitle2">Tags</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {postData.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </Stack>

        <Stack
          spacing={3}
          sx={{
            py: 3,
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}>
          <Typography variant="subtitle2">Meta</Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Meta Title:
              </Typography>

              <Typography variant="body2">{postData.metaTitle}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Meta Description:
              </Typography>

              <Typography variant="body2">
                {postData.metaDescription}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Meta Keywords:
              </Typography>

              <Typography variant="body2">
                {postData.metaKeywords?.join(", ")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          spacing={3}
          sx={{
            py: 3,
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}>
          <Typography variant="subtitle2">Comments</Typography>

          <FormControlLabel
            control={<Checkbox defaultChecked={postData.enableComments} />}
            label="Enable comments"
          />

          <PostCommentList postId={postData._id} />

          <PostCommentForm postId={postData._id} />
        </Stack>
      </Stack>
    </>
  );

  return (
    <>
      <Container maxWidth={false}>{renderPost}</Container>
    </>
  );
}

PostDetailsView.propTypes = {
  post: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
