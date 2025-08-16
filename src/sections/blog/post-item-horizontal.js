import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useResponsive } from "src/hooks/use-responsive";
import { useBoolean } from "src/hooks/use-boolean";

import { fDate } from "src/utils/format-time";
import { fShortenNumber } from "src/utils/format-number";

import Label from "src/components/label";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import TextMaxLine from "src/components/text-max-line";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function PostItemHorizontal({ post, onDeletePost }) {
  const popover = usePopover();
  const confirmDialog = useBoolean();

  const router = useRouter();

  const smUp = useResponsive("up", "sm");

  // Ensure all required fields exist with defaults
  const {
    _id: id, // Use _id from API response
    title = "Untitled",
    author = { name: "Admin", avatarUrl: "" },
    publish = "published",
    coverUrl = "",
    createdAt = new Date().toISOString(),
    totalViews = 0,
    totalShares = 0,
    totalComments = 0,
    description = "",
  } = post || {};

  console.log("Rendering post:", { id, title, publish, author });

  const handleDelete = () => {
    confirmDialog.onTrue();
  };

  const confirmDelete = async () => {
    try {
      await onDeletePost(id);
      confirmDialog.onFalse();
      popover.onClose();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}>
            <Label
              variant="soft"
              color={(publish === "published" && "info") || "default"}>
              {publish}
            </Label>

            <Box
              component="span"
              sx={{ typography: "caption", color: "text.disabled" }}>
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <Link
              color="inherit"
              component={RouterLink}
              href={paths.dashboard.post.details(title)}>
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton
              color={popover.open ? "inherit" : "default"}
              onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Stack
              spacing={1.5}
              flexGrow={1}
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{
                typography: "caption",
                color: "text.disabled",
              }}>
              <Stack direction="row" alignItems="center">
                <Iconify
                  icon="eva:message-circle-fill"
                  width={16}
                  sx={{ mr: 0.5 }}
                />
                {fShortenNumber(totalComments)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalViews)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalShares)}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: "relative",
              flexShrink: 0,
              p: 1,
            }}>
            <Avatar
              alt={author?.name}
              src={author?.avatarUrl}
              sx={{ position: "absolute", top: 16, right: 16, zIndex: 9 }}
            />
            <Image
              alt={title}
              src={coverUrl}
              sx={{ height: 1, borderRadius: 1.5 }}
            />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(title));
          }}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.edit(title));
          }}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.value} onClose={confirmDialog.onFalse}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDialog.onFalse}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PostItemHorizontal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
  onDeletePost: PropTypes.func,
};
