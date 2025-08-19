"use client";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { alpha, useTheme } from "@mui/material/styles";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import { useResponsive } from "src/hooks/use-responsive";

import { fDate } from "src/utils/format-time";

import { _socials } from "src/_mock";
import { bgGradient } from "src/theme/css";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import { useWebShare } from "src/hooks/use-web-share";

// React Share Components
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
} from "react-share";

// ----------------------------------------------------------------------

export default function PostDetailsHero({
  title,
  author,
  coverUrl,
  createdAt,
  description,
}) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { share: nativeShare, canShare } = useWebShare();

  const smUp = useResponsive("up", "sm");

  // Share functionality
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          enqueueSnackbar("Link copied to clipboard!", {
            variant: "success",
          });
        })
        .catch(() => {
          enqueueSnackbar("Failed to copy link", { variant: "error" });
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        enqueueSnackbar("Link copied to clipboard!", {
          variant: "success",
        });
      } catch (err) {
        enqueueSnackbar("Failed to copy link", { variant: "error" });
      }
      document.body.removeChild(textArea);
    }
  };

  // Share data
  const shareData = {
    url: typeof window !== "undefined" ? window.location.href : "",
    title: title,
    description:
      description ||
      (author?.name ? `By ${author.name}` : "Check out this blog post"),
    hashtags: ["blog", "cityautos"],
  };

  // Handle native sharing
  const handleNativeShare = async () => {
    const success = await nativeShare(shareData);
    if (!success) {
      enqueueSnackbar("Native sharing not supported on this device", {
        variant: "info",
      });
    }
  };

  return (
    <Box
      sx={{
        height: 480,
        overflow: "hidden",
      }}>
      <Container sx={{ height: 1, position: "relative" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            color: "#fff",
            position: "absolute",

            pt: { xs: 2, md: 8 },
          }}>
          {title}
        </Typography>

        <Stack
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: "absolute",
          }}>
          {author && createdAt && (
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                px: { xs: 2, md: 3 },
                pb: { xs: 3, md: 8 },
              }}>
              <Avatar
                alt={author.name}
                src={author.avatarUrl}
                sx={{ width: 64, height: 64, mr: 2 }}
              />

              <ListItemText
                sx={{ color: "common.white" }}
                primary={author.name}
                secondary={fDate(createdAt)}
                primaryTypographyProps={{ typography: "subtitle1", mb: 0.5 }}
                secondaryTypographyProps={{
                  color: "inherit",
                  sx: { opacity: 0.64 },
                }}
              />
            </Stack>
          )}

          <SpeedDial
            direction={smUp ? "left" : "up"}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: "medium" }}
            sx={{
              position: "absolute",
              bottom: { xs: 32, md: 64 },
              right: { xs: 16, md: 24 },
            }}>
            {/* Facebook Share */}
            <SpeedDialAction
              name="Facebook"
              icon={
                <FacebookShareButton {...shareData}>
                  <Iconify icon="eva:facebook-fill" />
                </FacebookShareButton>
              }
              tooltipTitle="Share on Facebook"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#1877F2",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#1877F2",
                  },
                },
              }}
            />

            {/* Twitter Share */}
            <SpeedDialAction
              name="Twitter"
              icon={
                <TwitterShareButton {...shareData}>
                  <Iconify icon="eva:twitter-fill" />
                </TwitterShareButton>
              }
              tooltipTitle="Share on Twitter"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#1DA1F2",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#1DA1F2",
                  },
                },
              }}
            />

            {/* LinkedIn Share */}
            <SpeedDialAction
              name="LinkedIn"
              icon={
                <LinkedinShareButton {...shareData}>
                  <Iconify icon="eva:linkedin-fill" />
                </LinkedinShareButton>
              }
              tooltipTitle="Share on LinkedIn"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#007EBB",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#007EBB",
                  },
                },
              }}
            />

            {/* WhatsApp Share */}
            <SpeedDialAction
              name="WhatsApp"
              icon={
                <WhatsappShareButton {...shareData}>
                  <Iconify icon="eva:message-circle-fill" />
                </WhatsappShareButton>
              }
              tooltipTitle="Share on WhatsApp"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#25D366",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#25D366",
                  },
                },
              }}
            />

            {/* Telegram Share */}
            <SpeedDialAction
              name="Telegram"
              icon={
                <TelegramShareButton {...shareData}>
                  <Iconify icon="eva:message-square-fill" />
                </TelegramShareButton>
              }
              tooltipTitle="Share on Telegram"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#0088CC",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#0088CC",
                  },
                },
              }}
            />

            {/* Email Share */}
            <SpeedDialAction
              name="Email"
              icon={
                <EmailShareButton {...shareData}>
                  <Iconify icon="eva:email-fill" />
                </EmailShareButton>
              }
              tooltipTitle="Share via Email"
              tooltipPlacement="top"
              FabProps={{
                sx: {
                  bgcolor: "#EA4335",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#EA4335",
                  },
                },
              }}
            />

            {/* Native Share (Mobile) */}
            {canShare && (
              <SpeedDialAction
                name="Share"
                icon={<Iconify icon="eva:share-fill" />}
                tooltipTitle="Share"
                tooltipPlacement="top"
                onClick={handleNativeShare}
                FabProps={{
                  sx: {
                    bgcolor: "#4CAF50",
                    color: "common.white",
                    "&:hover": {
                      bgcolor: "#4CAF50",
                    },
                  },
                }}
              />
            )}

            {/* Copy Link */}
            <SpeedDialAction
              name="Copy Link"
              icon={<Iconify icon="eva:link-2-fill" />}
              tooltipTitle="Copy Link"
              tooltipPlacement="top"
              onClick={handleCopyLink}
              FabProps={{
                sx: {
                  bgcolor: "#666666",
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "#666666",
                  },
                },
              }}
            />
          </SpeedDial>
        </Stack>
      </Container>
    </Box>
  );
}

PostDetailsHero.propTypes = {
  author: PropTypes.object,
  coverUrl: PropTypes.string,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
};
