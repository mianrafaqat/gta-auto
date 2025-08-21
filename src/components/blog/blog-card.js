"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Utils
import { fDate } from "src/utils/format-time";
import { fShortenNumber } from "src/utils/format-number";

// ----------------------------------------------------------------------

const BlogCard = ({ post, onViewDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[20],
        },
      }}
      onClick={onViewDetails}>
      <CardMedia
        component="img"
        height={isMobile ? 200 : 240}
        image={post.coverUrl || "/assets/placeholder.svg"}
        alt={post.title}
        sx={{
          objectFit: "cover",
          position: "relative",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {post.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="soft"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))}
              {post.tags.length > 3 && (
                <Chip
                  label={`+${post.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.6em",
            }}>
            {post.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "4.5em",
              lineHeight: 1.6,
            }}>
            {post.description}
          </Typography>

          {/* Meta Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 1,
            }}>
            <Typography variant="caption" color="text.secondary">
              {fDate(post.createdAt || new Date())}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {fShortenNumber(post.viewCount || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 1,
            }}>
            <Button
              variant="text"
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: "primary.main", fontWeight: 600 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}>
              Read More
            </Button>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                sx={{ color: isLiked ? "error.main" : "text.secondary" }}>
                {isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                sx={{ color: isShared ? "success.main" : "text.secondary" }}>
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
