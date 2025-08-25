import PropTypes from "prop-types";
import { useState, useEffect, useImperativeHandle } from "react";
import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

import { BlogCommentService } from "src/services";
import { useSnackbar } from "src/components/snackbar";
import BlogCommentItem from "./blog-comment-item";

// ----------------------------------------------------------------------

const BlogCommentList = React.forwardRef(
  ({ postId, currentUser, isLoading: userLoading }, ref) => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      totalComments: 0,
    });

    const fetchComments = async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await BlogCommentService.getByBlog(postId, {
          page,
          limit: 10,
        });

        const { comments: fetchedComments, pagination: paginationData } =
          response.data;

        setComments(fetchedComments);
        setPagination({
          page: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalComments: paginationData.totalComments,
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again later.");
        enqueueSnackbar("Failed to load comments", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    // Expose fetchComments to parent through ref
    useImperativeHandle(ref, () => ({
      fetchComments,
    }));

    useEffect(() => {
      if (postId && !userLoading) {
        fetchComments();
      }
    }, [postId, userLoading]);

    const handlePageChange = (event, page) => {
      fetchComments(page);
    };

    const handleUpdate = async (commentId, newComment) => {
      try {
        await BlogCommentService.update(commentId, { comment: newComment });
        enqueueSnackbar("Comment updated successfully", { variant: "success" });
        fetchComments(pagination.page); // Refresh current page
      } catch (error) {
        console.error("Error updating comment:", error);
        enqueueSnackbar("Failed to update comment", { variant: "error" });
        throw error; // Re-throw to handle in the component
      }
    };

    const handleDelete = async (commentId) => {
      try {
        await BlogCommentService.delete(commentId);
        enqueueSnackbar("Comment deleted successfully", { variant: "success" });
        fetchComments(pagination.page); // Refresh current page
      } catch (error) {
        console.error("Error deleting comment:", error);
        enqueueSnackbar("Failed to delete comment", { variant: "error" });
      }
    };

    if (loading || userLoading) {
      return (
        <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
      );
    }

    if (!comments.length) {
      return (
        <Alert severity="info" sx={{ my: 3 }}>
          No comments yet. Be the first to comment!
        </Alert>
      );
    }

    return (
      <Stack spacing={3} sx={{ pt: 3 }}>
        {comments.map((comment) => (
          <BlogCommentItem
            key={comment._id}
            name={comment.user?.name || "Anonymous"}
            avatarUrl={comment.user?.avatarUrl}
            comment={comment.comment}
            createdAt={comment.createdAt}
            isAuthor={comment.user?.id === currentUser?._id}
            onEdit={
              comment.user?.id === currentUser?._id
                ? (newComment) => handleUpdate(comment._id, newComment)
                : null
            }
            onDelete={
              comment.user?.id === currentUser?._id
                ? () => handleDelete(comment._id)
                : null
            }
          />
        ))}

        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
            <Pagination
              page={pagination.page}
              count={pagination.totalPages}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Stack>
    );
  }
);

BlogCommentList.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default BlogCommentList;
