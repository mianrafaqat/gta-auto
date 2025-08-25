"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSnackbar } from "src/components/snackbar";
import { BlogCommentService, UserService } from "src/services";

// ----------------------------------------------------------------------

export default function PostCommentForm({ postId, blogId, onCommentPosted }) {
  // Use postId if provided, fallback to blogId for backward compatibility
  const targetBlogId = postId || blogId;
  const CommentSchema = Yup.object().shape({
    comment: Yup.string()
      .required("Comment is required")
      .min(1, "Comment must be at least 1 character")
      .max(1000, "Comment must not exceed 1000 characters"),
  });

  const defaultValues = {
    comment: "",
  };

  const { enqueueSnackbar } = useSnackbar();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        const userData = response?.data || response;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
        enqueueSnackbar("Please log in to post comments", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [enqueueSnackbar]);

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Check if user is logged in
      if (!currentUser) {
        enqueueSnackbar("Please log in to post comments", { variant: "error" });
        return;
      }

      // Check if blog ID is provided
      if (!targetBlogId) {
        enqueueSnackbar("Blog ID is required", { variant: "error" });
        return;
      }

      console.log("Submitting comment:", {
        blogId: targetBlogId,
        ...data,
        user: currentUser,
      });

      // Call the blog comment service to create a new comment
      const response = await BlogCommentService.create({
        blogId: targetBlogId,
        comment: data.comment,
        user: {
          id: currentUser._id || currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
      });

      console.log("Comment created successfully:", response);

      // Show success message
      enqueueSnackbar("Comment posted successfully!", { variant: "success" });

      // Reset the form
      reset();

      // Call the callback to refresh comments if provided
      if (onCommentPosted && typeof onCommentPosted === "function") {
        onCommentPosted();
      }
    } catch (error) {
      console.error("Error posting comment:", error);

      // Show error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to post comment";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField
          name="comment"
          placeholder="Write some of your comments..."
          multiline
          rows={4}
          sx={{
            "& .MuiInputBase-input": {
              color: "#fff",
            },
          }}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || loading}
            disabled={!currentUser}>
            {!currentUser ? "Please log in to comment" : "Post comment"}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

PostCommentForm.propTypes = {
  postId: PropTypes.string,
  blogId: PropTypes.string,
  onCommentPosted: PropTypes.func,
};

// Ensure at least one of postId or blogId is provided
PostCommentForm.propTypes.isRequired = function (props) {
  if (!props.postId && !props.blogId) {
    return new Error("Either postId or blogId must be provided");
  }
  return null;
};
