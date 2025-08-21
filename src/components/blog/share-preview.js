"use client";

import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { fDate } from "src/utils/format-time";

export default function SharePreview({ post }) {
  if (!post) return null;

  return (
    <Card sx={{ maxWidth: 400, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Share Preview
        </Typography>

        <Box sx={{ mb: 2 }}>
          {post.coverUrl && (
            <img
              src={post.coverUrl}
              alt={post.title}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {post.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          {post.author && (
            <>
              <Avatar
                alt={post.author.name}
                src={post.author.avatarUrl}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2">By {post.author.name}</Typography>
            </>
          )}
          {post.createdAt && (
            <Typography variant="body2" color="text.secondary">
              {fDate(post.createdAt)}
            </Typography>
          )}
        </Stack>

        {post.tags && post.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

SharePreview.propTypes = {
  post: PropTypes.object,
};
