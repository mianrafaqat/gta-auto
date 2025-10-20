import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Skeleton,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/iconify";

const ForumTopics = ({ topics, loading, onTopicClick, onLike, onPin, onDelete, onLock, isAdmin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event, topic) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTopic(topic);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedTopic here, as we need it for delete confirmation
  };

  const handlePinClick = () => {
    if (selectedTopic && onPin) {
      onPin(selectedTopic.id, !selectedTopic.isPinned);
    }
    handleMenuClose();
    // Clear selected topic after action
    setSelectedTopic(null);
  };

  const handleLockClick = () => {
    if (selectedTopic && onLock) {
      onLock(selectedTopic.id, !selectedTopic.isLocked);
    }
    handleMenuClose();
    // Clear selected topic after action
    setSelectedTopic(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
    // Don't clear selectedTopic - we need it for the confirmation dialog
  };

  const handleDeleteConfirm = () => {
    if (selectedTopic && onDelete) {
      onDelete(selectedTopic.id);
    }
    setDeleteDialogOpen(false);
    setSelectedTopic(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTopic(null);
  };
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#4CAF50" }}>
          Topics
        </Typography>
        {[...Array(5)].map((_, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}>
            <Stack spacing={2}>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
              <Stack direction="row" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" height={16} />
                  <Skeleton variant="text" width="30%" height={16} />
                </Box>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Box>
    );
  }

  if (topics.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}>
        <Iconify
          icon="eva:message-circle-outline"
          sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 1, color: "#4CAF50" }}>
          No topics found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ color: "#4CAF50" }}  >
          Try adjusting your search or filter criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#4CAF50" , }}>
        Topics ({topics.length})
      </Typography>

      <Stack spacing={2}>
        {topics.map((topic) => (
          <Paper
            key={topic.id}
            elevation={topic.isPinned ? 1 : 0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: topic.isPinned ? "#4CAF50" : "divider",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              bgcolor:  "background.paper",
              "&:hover": {
                borderColor: "#4CAF50",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => onTopicClick(topic.id)}>
            <Stack spacing={2}>
              {/* Topic Header */}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar
                  src={topic.authorAvatar}
                  alt={topic.author}
                  sx={{ width: 48, height: 48 }}>
                  {topic.author.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      flexWrap: "wrap",
                    }}>
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: topic.isPinned ? "#4CAF50" : "text.primary",
                        "&:hover": { color: "#4CAF50" },
                      }}>
                      {topic.title}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {topic.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#4CAF50",
                          color: "#4CAF50",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Divider />

              {/* Topic Stats */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Stack direction="row" spacing={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Iconify
                      icon="eva:message-circle-outline"
                      sx={{ fontSize: 16 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {topic.replies} replies
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Iconify icon="eva:eye-outline" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      {topic.views} views
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    startIcon={
                      <Iconify
                        icon={
                          topic.isLiked ? "eva:heart-fill" : "eva:heart-outline"
                        }
                        sx={{
                          fontSize: 16,
                          color: topic.isLiked ? "#e91e63" : "inherit",
                        }}
                      />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike && onLike(topic.id);
                    }}
                    sx={{
                      color: topic.isLiked ? "#e91e63" : "text.secondary",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": { color: "#e91e63" },
                    }}>
                    {topic.likes || 0}
                  </Button>
                </Stack>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    by {topic.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {topic.lastActivity}
                  </Typography>
                  {isAdmin && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, topic)}
                      sx={{
                        ml: 1,
                        color: "text.secondary",
                        "&:hover": { color: "#4CAF50" },
                      }}>
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Admin Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem onClick={handlePinClick}>
          <Iconify
            icon={selectedTopic?.isPinned ? "eva:pin-outline" : "eva:pin-fill"}
            sx={{ mr: 1, color: "#4CAF50" }}
          />
          {selectedTopic?.isPinned ? "Unpin Topic" : "Pin Topic"}
        </MenuItem>
        <MenuItem onClick={handleLockClick}>
          <Iconify
            icon={selectedTopic?.isLocked ? "eva:unlock-outline" : "eva:lock-outline"}
            sx={{ mr: 1, color: "#FF9800" }}
          />
          {selectedTopic?.isLocked ? "Unlock Topic" : "Lock Topic"}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} />
          Delete Topic
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
    </Box>
  );
};

export default ForumTopics;
