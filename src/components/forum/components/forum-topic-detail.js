import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Button,
  TextField,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Skeleton,
} from "@mui/material";
import Iconify from "src/components/iconify";
import ForumService from "src/services/forum/forum.service";
import { useAuthContext } from "src/auth/hooks";
import { useSnackbar } from "src/components/snackbar";

const ForumTopicDetail = ({ topic, onClose, onLike, onComment, onReply, onPin, onDelete, onLock, isAdmin }) => {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const currentUserId = user?.user?._id;
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Load comments when topic changes
  useEffect(() => {
    if (topic?.id) {
      loadComments();
    }
  }, [topic?.id]);

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await ForumService.getCommentsByTopic(topic.id);

      if (response?.data?.success) {
        const apiComments = response.data.data.comments;

        // Transform API comments and load replies for each
        const transformedComments = await Promise.all(
          apiComments.map(async (comment) => {
            // Load replies for this comment
            let replies = [];
            try {
              const repliesResponse = await ForumService.getRepliesByComment(comment._id);
              console.log(`Full replies response for comment ${comment._id}:`, JSON.stringify(repliesResponse, null, 2));
              
              // Handle multiple possible response structures
              let apiReplies = [];
              
              if (repliesResponse?.data?.success && repliesResponse.data.data?.replies) {
                // Structure: {data: {success: true, data: {replies: [...]}}}
                apiReplies = repliesResponse.data.data.replies;
                console.log(`✅ Found ${apiReplies.length} replies (nested data structure)`);
              } else if (repliesResponse?.data?.replies) {
                // Structure: {data: {replies: [...]}}
                apiReplies = repliesResponse.data.replies;
                console.log(`✅ Found ${apiReplies.length} replies (direct structure)`);
              } else if (Array.isArray(repliesResponse?.data?.data)) {
                // Structure: {data: {data: [...]}}
                apiReplies = repliesResponse.data.data;
                console.log(`✅ Found ${apiReplies.length} replies (array in data.data)`);
              } else if (Array.isArray(repliesResponse?.data)) {
                // Structure: {data: [...]}
                apiReplies = repliesResponse.data;
                console.log(`✅ Found ${apiReplies.length} replies (array in data)`);
              } else {
                console.warn(`❌ Unknown response structure for comment ${comment._id}:`, repliesResponse?.data);
              }
              
              replies = apiReplies.map((reply) => ({
                id: reply._id,
                author: reply.author?.name || "Anonymous",
                authorId: reply.author?._id,
                authorAvatar: reply.author?.avatarUrl || "/assets/avatars/avatar_default.jpg",
                content: reply.content,
                timestamp: formatTimestamp(reply.createdAt),
                likes: reply.likesCount || 0,
                isLiked: reply.likes?.includes(currentUserId) || false,
              }));
              
              console.log(`Processed ${replies.length} replies for comment ${comment._id}`);
            } catch (error) {
              console.error(`❌ Error loading replies for comment ${comment._id}:`, error);
              console.error("Error status:", error?.response?.status);
              console.error("Error data:", error?.response?.data);
            }

            return {
              id: comment._id,
              author: comment.author?.name || "Anonymous",
              authorId: comment.author?._id,
              authorAvatar: comment.author?.avatarUrl || "/assets/avatars/avatar_default.jpg",
              content: comment.content,
              timestamp: formatTimestamp(comment.createdAt),
              likes: comment.likesCount || 0,
              isLiked: comment.likes?.includes(currentUserId) || false,
              replies,
            };
          })
        );

        console.log("📝 Final transformed comments with replies:", transformedComments);
        setComments(transformedComments);
      } else {
        console.warn("No comments found in response");
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const handleLikeTopic = () => {
    if (onLike) {
      onLike(topic.id);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      try {
        const response = await ForumService.createComment(topic.id, {
          content: commentText,
        });

        console.log("Comment creation response:", response);

        if (response?.data?.success) {
          enqueueSnackbar("Comment posted successfully!", { variant: "success" });
          
          // Clear comment text
          setCommentText("");

          // Reload comments to get the persisted comment from the backend
          await loadComments();

          if (onComment) {
            onComment(topic.id, commentText);
          }
        } else {
          console.warn("Comment creation failed:", response);
          enqueueSnackbar("Failed to post comment. Please try again.", { variant: "error" });
        }
      } catch (error) {
        console.error("Error creating comment:", error);
        console.error("Error details:", error?.response?.data);
        enqueueSnackbar(
          error?.response?.data?.message || "Failed to post comment. Please try again.",
          { variant: "error" }
        );
      }
    }
  };

  const handleReplySubmit = async () => {
    if (replyText.trim() && selectedComment) {
      try {
        const response = await ForumService.createReply(selectedComment.id, {
          content: replyText,
        });

        console.log("Reply creation response:", response);

        if (response?.data?.success) {
          enqueueSnackbar("Reply posted successfully!", { variant: "success" });
          
          // Close dialog and clear state
          setReplyText("");
          setShowReplyDialog(false);
          setSelectedComment(null);

          // Reload comments to get the persisted reply from the backend
          await loadComments();
        } else {
          console.warn("Reply creation failed:", response);
          enqueueSnackbar("Failed to post reply. Please try again.", { variant: "error" });
        }
      } catch (error) {
        console.error("Error creating reply:", error);
        console.error("Error details:", error?.response?.data);
        enqueueSnackbar(
          error?.response?.data?.message || "Failed to post reply. Please try again.",
          { variant: "error" }
        );
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await ForumService.toggleCommentLike(commentId);

      if (response?.data?.success) {
        const { isLiked, likesCount } = response.data.data;

        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked,
                  likes: likesCount,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      const response = await ForumService.toggleReplyLike(replyId);

      if (response?.data?.success) {
        const { isLiked, likesCount } = response.data.data;

        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === replyId
                      ? {
                          ...reply,
                          isLiked,
                          likes: likesCount,
                        }
                      : reply
                  ),
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error toggling reply like:", error);
    }
  };

  const handleReplyClick = (comment) => {
    setSelectedComment(comment);
    setShowReplyDialog(true);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePinClick = () => {
    if (onPin) {
      onPin(topic.id, !topic.isPinned);
    }
    handleMenuClose();
  };

  const handleLockClick = () => {
    if (onLock) {
      onLock(topic.id, !topic.isLocked);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (onDelete && topic) {
      onDelete(topic.id);
    } else {
      console.error("onDelete handler not provided or topic missing");
    }
    setDeleteDialogOpen(false);
    onClose();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await ForumService.deleteComment(commentId);
      if (response?.data?.success || response?.status === 200 || response?.status === 204) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        enqueueSnackbar("Comment deleted successfully!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      enqueueSnackbar("Failed to delete comment", { variant: "error" });
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const response = await ForumService.deleteReply(replyId);
      if (response?.data?.success || response?.status === 200 || response?.status === 204) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((reply) => reply.id !== replyId),
                }
              : comment
          )
        );
        enqueueSnackbar("Reply deleted successfully!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      enqueueSnackbar("Failed to delete reply", { variant: "error" });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {topic.isPinned && (
                <Chip
                  icon={<Iconify icon="eva:pin-fill" sx={{ fontSize: 14 }} />}
                  label="PINNED"
                  size="small"
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              )}
              {topic.isLocked && (
                <Chip
                  icon={<Iconify icon="eva:lock-fill" sx={{ fontSize: 14 }} />}
                  label="LOCKED"
                  size="small"
                  sx={{
                    bgcolor: "error.main",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              )}
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: { xs: 1.3, sm: 1.4 },
                wordBreak: 'break-word',
                color: topic.isPinned ? "#4CAF50" : "text.primary",
              }}
            >
              {topic.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ mt: -1 }}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Topic Content */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
              <Avatar
                src={topic.authorAvatar}
                alt={topic.author}
                sx={{ width: 48, height: 48 }}>
                {topic.author.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {topic.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {topic.lastActivity}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 , wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, sm: 1 },
              WebkitBoxOrient: 'vertical' }}>
              {topic.content ||
                "This is the topic content. It would contain the full text of the forum post."}
            </Typography>

            {topic.tags && topic.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {topic.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#4CAF50",
                      color: "#4CAF50",
                    }}
                  />
                ))}
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Topic Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Stack direction="row" spacing={2}>
                <Button
                  startIcon={
                    <Iconify
                      icon={
                        topic.isLiked ? "eva:heart-fill" : "eva:heart-outline"
                      }
                      sx={{ color: topic.isLiked ? "#e91e63" : "inherit" }}
                    />
                  }
                  onClick={handleLikeTopic}
                  sx={{
                    color: topic.isLiked ? "#e91e63" : "text.secondary",
                    "&:hover": { color: "#e91e63" },
                  }}>
                  {topic.likes || 0} Likes
                </Button>

                <Button
                  startIcon={<Iconify icon="eva:message-circle-outline" />}
                  sx={{ color: "text.secondary" }}>
                  {topic.replies} Replies
                </Button>

                <Button
                  startIcon={<Iconify icon="eva:eye-outline" />}
                  sx={{ color: "text.secondary" }}>
                  {topic.views} Views
                </Button>
              </Stack>

              <IconButton onClick={handleMenuClick}>
                <Iconify icon="eva:more-horizontal-fill" />
              </IconButton>
            </Box>
          </Paper>

          {/* Comments Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Comments ({comments.length})
            </Typography>

            {commentsLoading && (
              <Stack spacing={2}>
                {[...Array(3)].map((_, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="30%" height={20} />
                          <Skeleton variant="text" width="20%" height={16} />
                        </Box>
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Add Comment */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                mb: 2,
              }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "white",
                    "&:hover": { bgcolor: "#45a049" },
                  }}>
                  Post Comment
                </Button>
              </Box>
            </Paper>

            {/* Comments List */}
            {!commentsLoading && (
              <Stack spacing={2}>
                {comments.map((comment) => (
                  <Paper
                    key={comment.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}>
                      <Avatar
                        src={comment.authorAvatar}
                        alt={comment.author}
                        sx={{ width: 40, height: 40 }}>
                        {comment.author.charAt(0)}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}>
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.timestamp}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {comment.content}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Button
                        size="small"
                        startIcon={
                          <Iconify
                            icon={
                              comment.isLiked
                                ? "eva:heart-fill"
                                : "eva:heart-outline"
                            }
                            sx={{
                              fontSize: 16,
                              color: comment.isLiked ? "#e91e63" : "inherit",
                            }}
                          />
                        }
                        onClick={() => handleLikeComment(comment.id)}
                        sx={{
                          color: comment.isLiked ? "#e91e63" : "text.secondary",
                          minWidth: "auto",
                          px: 1,
                        }}>
                        {comment.likes}
                      </Button>

                      <Button
                        size="small"
                        onClick={() => handleReplyClick(comment)}
                        sx={{
                          color: "text.secondary",
                          minWidth: "auto",
                          px: 1,
                        }}>
                        Reply
                      </Button>

                      {(comment.authorId === currentUserId || isAdmin) && (
                        <Button
                          size="small"
                          startIcon={<Iconify icon="eva:trash-2-outline" />}
                          onClick={() => handleDeleteComment(comment.id)}
                          sx={{
                            color: "error.main",
                            minWidth: "auto",
                            px: 1,
                          }}>
                          Delete
                        </Button>
                      )}
                    </Box>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ mt: 2, ml: 4 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: "block" }}>
                          Replies ({comment.replies.length})
                        </Typography>
                        <Stack spacing={1}>
                          {comment.replies.map((reply) => (
                            <Paper
                              key={reply.id}
                              elevation={0}
                              sx={{
                                p: 1.5,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                              }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                  mb: 1,
                                }}>
                                <Avatar
                                  src={reply.authorAvatar}
                                  alt={reply.author}
                                  sx={{ width: 24, height: 24 }}>
                                  {reply.author.charAt(0)}
                                </Avatar>

                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 600 }}>
                                    {reply.author}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block" }}>
                                    {reply.timestamp}
                                  </Typography>
                                </Box>
                              </Box>

                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {reply.content}
                              </Typography>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={
                                    <Iconify
                                      icon={
                                        reply.isLiked
                                          ? "eva:heart-fill"
                                          : "eva:heart-outline"
                                      }
                                      sx={{
                                        fontSize: 14,
                                        color: reply.isLiked
                                          ? "#e91e63"
                                          : "inherit",
                                      }}
                                    />
                                  }
                                  onClick={() =>
                                    handleLikeReply(comment.id, reply.id)
                                  }
                                  sx={{
                                    color: reply.isLiked
                                      ? "#e91e63"
                                      : "text.secondary",
                                    minWidth: "auto",
                                    px: 1,
                                    py: 0.5,
                                    fontSize: "0.75rem",
                                  }}>
                                  {reply.likes}
                                </Button>

                                {(reply.authorId === currentUserId || isAdmin) && (
                                  <Button
                                    size="small"
                                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                                    onClick={() => handleDeleteReply(comment.id, reply.id)}
                                    sx={{
                                      color: "error.main",
                                      minWidth: "auto",
                                      px: 1,
                                      py: 0.5,
                                      fontSize: "0.75rem",
                                    }}>
                                    Delete
                                  </Button>
                                )}
                              </Box>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      {/* Reply Dialog */}
      <Dialog
        open={showReplyDialog}
        onClose={() => setShowReplyDialog(false)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Reply to Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReplyDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleReplySubmit}
            disabled={!replyText.trim()}
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": { bgcolor: "#45a049" },
            }}>
            Post Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Topic Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        {isAdmin && [
          <MenuItem key="pin" onClick={handlePinClick}>
            <Iconify
              icon={topic.isPinned ? "eva:pin-outline" : "eva:pin-fill"}
              sx={{ mr: 1, color: "#4CAF50" }}
            />
            {topic.isPinned ? "Unpin Topic" : "Pin Topic"}
          </MenuItem>,
          <MenuItem key="lock" onClick={handleLockClick}>
            <Iconify
              icon={topic.isLocked ? "eva:unlock-outline" : "eva:lock-outline"}
              sx={{ mr: 1, color: "#FF9800" }}
            />
            {topic.isLocked ? "Unlock Topic" : "Lock Topic"}
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} />
            Delete Topic
          </MenuItem>,
          <Divider key="divider" />
        ]}
        <MenuItem onClick={handleMenuClose}>
          <Iconify icon="eva:share-outline" sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Iconify icon="eva:flag-outline" sx={{ mr: 1 }} />
          Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Iconify icon="eva:bookmark-outline" sx={{ mr: 1 }} />
          Bookmark
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth>
        <DialogTitle>Delete Topic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this topic? This action cannot be
            undone and will also delete all associated comments and replies.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ForumTopicDetail;
