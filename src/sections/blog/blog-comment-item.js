import PropTypes from "prop-types";
import { useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function BlogCommentItem({
  name,
  avatarUrl,
  comment,
  createdAt,
  isAuthor,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedComment(comment);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedComment(comment);
  };

  const handleSaveEdit = async () => {
    if (!editedComment.trim()) return;
    setIsSubmitting(true);
    try {
      await onEdit(editedComment);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        p: 3,
        bgcolor: "rgba(145, 158, 171, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s",
        "&:hover": {
          bgcolor: "rgba(145, 158, 171, 0.12)",
        },
      }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            border: "2px solid",
            borderColor: "background.default",
          }}>
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={{ color: "#fff" }}>
              {name}
            </Typography>
            {isAuthor && (
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  typography: "caption",
                  borderRadius: 0.75,
                  bgcolor: "primary.lighter",
                  color: "primary.main",
                }}>
                Author
              </Box>
            )}
          </Stack>

          <Typography
            variant="caption"
            sx={{ color: "text.disabled", mt: "4px" }}>
            {fDateTime(createdAt)}
          </Typography>
        </Stack>

        {/* Actions */}
        {(onEdit || onDelete) && !isEditing && (
          <Stack direction="row" spacing={1}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={handleStartEdit}
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "primary.lighter" },
                }}>
                <Iconify icon="solar:pen-bold" width={20} />
              </IconButton>
            )}

            {onDelete && (
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  color: "error.main",
                  "&:hover": { bgcolor: "error.lighter" },
                }}>
                <Iconify icon="solar:trash-bin-trash-bold" width={20} />
              </IconButton>
            )}
          </Stack>
        )}
      </Stack>

      {/* Comment Content */}
      {isEditing ? (
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            placeholder="Edit your comment..."
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.neutral",
              },
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSaveEdit}
              loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Stack>
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            whiteSpace: "pre-wrap",
          }}>
          {comment}
        </Typography>
      )}
    </Stack>
  );
}

BlogCommentItem.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  comment: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  isAuthor: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
