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
} from "@mui/material";
import Iconify from "src/components/iconify";

const ForumTopics = ({ topics, loading, onTopicClick, onLike }) => {
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
        <Typography variant="h6" sx={{ mb: 1 }}>
          No topics found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Topics ({topics.length})
      </Typography>

      <Stack spacing={2}>
        {topics.map((topic) => (
          <Paper
            key={topic.id}
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
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
                    }}>
                    {topic.isPinned && (
                      <Iconify
                        icon="eva:pin-fill"
                        sx={{ fontSize: 16, color: "#4CAF50" }}
                      />
                    )}
                    {topic.isLocked && (
                      <Iconify
                        icon="eva:lock-fill"
                        sx={{ fontSize: 16, color: "error.main" }}
                      />
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
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
                </Box>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default ForumTopics;
