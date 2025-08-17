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
  DialogActions,
  Alert,
  Skeleton,
} from "@mui/material";
import Iconify from "src/components/iconify";
import ForumService from "src/services/forum/forum.service";

const ForumTopicDetail = ({ topic, onClose, onLike, onComment, onReply }) => {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

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

        // Transform API comments to match component expectations
        const transformedComments = apiComments.map((comment) => ({
          id: comment._id,
          author: comment.author?.name || "Anonymous",
          authorAvatar:
            comment.author?.avatarUrl || "/assets/avatars/avatar_default.jpg",
          content: comment.content,
          timestamp: formatTimestamp(comment.createdAt),
          likes: comment.likesCount || 0,
          isLiked: comment.likes?.includes(comment.author?._id) || false,
          replies: [], // We'll load replies separately if needed
        }));

        setComments(transformedComments);
      } else {
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

        if (response?.data?.success) {
          const newComment = {
            id: response.data.data._id,
            author: response.data.data.author?.name || "You",
            authorAvatar:
              response.data.data.author?.avatarUrl ||
              "/assets/avatars/avatar_current.jpg",
            content: commentText,
            timestamp: "Just now",
            likes: 0,
            isLiked: false,
            replies: [],
          };
          setComments([newComment, ...comments]);
          setCommentText("");

          if (onComment) {
            onComment(topic.id, commentText);
          }
        }
      } catch (error) {
        console.error("Error creating comment:", error);
      }
    }
  };

  const handleReplySubmit = async () => {
    if (replyText.trim() && selectedComment) {
      try {
        const response = await ForumService.createReply(selectedComment.id, {
          content: replyText,
        });

        if (response?.data?.success) {
          const newReply = {
            id: response.data.data._id,
            author: response.data.data.author?.name || "You",
            authorAvatar:
              response.data.data.author?.avatarUrl ||
              "/assets/avatars/avatar_current.jpg",
            content: replyText,
            timestamp: "Just now",
            likes: 0,
            isLiked: false,
          };

          const updatedComments = comments.map((comment) =>
            comment.id === selectedComment.id
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          );

          setComments(updatedComments);
          setReplyText("");
          setShowReplyDialog(false);
          setSelectedComment(null);
        }
      } catch (error) {
        console.error("Error creating reply:", error);
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
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {topic.title}
          </Typography>
          <IconButton onClick={onClose}>
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

            <Typography variant="body1" sx={{ mb: 2 }}>
              {topic.content ||
                "This is the topic content. It would contain the full text of the forum post."}
            </Typography>

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
                    </Box>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
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
    </Dialog>
  );
};

export default ForumTopicDetail;
