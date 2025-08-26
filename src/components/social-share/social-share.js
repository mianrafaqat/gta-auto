import PropTypes from "prop-types";
import { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from "react-share";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import XIcon from "@mui/icons-material/X";

// ----------------------------------------------------------------------

export default function SocialShare({
  title,
  url,
  description,
  image,
  price,
  hashtags = [],
  size = 32,
  showLabels = false,
  variant = "icons", // 'icons' | 'buttons'
  sx,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [copying, setCopying] = useState(false);

  // Construct share data
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "Check out this product";
  const shareDescription =
    description ||
    `${shareTitle} - ${price ? `Price: ${price}` : "Great deal!"}`;
  const shareImage = image || "";
  const shareHashtags = ["CityAutos", "Cars", "Automotive", ...hashtags];

  const handleCopyUrl = async () => {
    setCopying(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      enqueueSnackbar("URL copied to clipboard!", { variant: "success" });
    } catch (err) {
      console.error("Failed to copy URL:", err);
      enqueueSnackbar("Failed to copy URL", { variant: "error" });
    } finally {
      setCopying(false);
    }
  };

  const buttonStyle = {
    cursor: "pointer",
    transition: "transform 0.2s ease, opacity 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
      opacity: 0.8,
    },
  };

  if (variant === "buttons") {
    return (
      <Stack direction="row" spacing={1} sx={sx} {...other}>
        <FacebookShareButton
          url={shareUrl}
          quote={shareDescription}
          hashtag={`#${shareHashtags[0]}`}>
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#45a049" },
            }}>
            <Iconify
              icon="ri:facebook-fill"
              width={16}
              sx={{ color: "#fff" }}
            />
          </Box>
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={shareDescription}
          hashtags={shareHashtags}>
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#45a049" },
            }}>
            <XIcon width={16} sx={{ color: "#fff" }} />
          </Box>
        </TwitterShareButton>

        <PinterestShareButton
          url={shareUrl}
          description={shareDescription}
          media={shareImage}>
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#45a049" },
            }}>
            <Iconify
              icon="ri:pinterest-fill"
              width={16}
              sx={{ color: "#fff" }}
            />
          </Box>
        </PinterestShareButton>

        <Tooltip title="Copy URL">
          <Box
            onClick={handleCopyUrl}
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#45a049" },
            }}>
            <Iconify
              icon={copying ? "eos-icons:loading" : "solar:copy-bold"}
              width={16}
              sx={{
                color: "#fff",
                animation: copying ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            {showLabels && <Typography variant="body2">Copy</Typography>}
          </Box>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={sx} {...other}>
      <Tooltip title="Share on Facebook">
        <Box sx={buttonStyle}>
          <FacebookShareButton
            url={shareUrl}
            quote={shareDescription}
            hashtag={`#${shareHashtags[0]}`}>
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#45a049" },
              }}>
              <Iconify
                icon="ri:facebook-fill"
                width={size * 0.5}
                sx={{ color: "#fff" }}
              />
            </Box>
          </FacebookShareButton>
        </Box>
      </Tooltip>

      <Tooltip title="Share on Twitter">
        <Box sx={buttonStyle}>
          <TwitterShareButton
            url={shareUrl}
            title={shareDescription}
            hashtags={shareHashtags}>
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#45a049" },
              }}>
              <XIcon width="12px" fontSize="24px" sx={{ color: "#fff" }} />
            </Box>
          </TwitterShareButton>
        </Box>
      </Tooltip>

      <Tooltip title="Share on Pinterest">
        <Box sx={buttonStyle}>
          <PinterestShareButton
            url={shareUrl}
            description={shareDescription}
            media={shareImage}>
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#45a049" },
              }}>
              <Iconify
                icon="ri:pinterest-fill"
                width={size * 0.5}
                sx={{ color: "#fff" }}
              />
            </Box>
          </PinterestShareButton>
        </Box>
      </Tooltip>

      <Tooltip title="Copy URL">
        <Box
          onClick={handleCopyUrl}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "#4CAF50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#45a049",
              transform: "scale(1.1)",
            },
          }}>
          <Iconify
            icon={copying ? "eos-icons:loading" : "solar:copy-bold"}
            width={size * 0.5}
            sx={{
              color: "#fff",
              animation: copying ? "spin 1s linear infinite" : "none",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      </Tooltip>
    </Stack>
  );
}

SocialShare.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  price: PropTypes.string,
  hashtags: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  showLabels: PropTypes.bool,
  variant: PropTypes.oneOf(["icons", "buttons"]),
  sx: PropTypes.object,
};
