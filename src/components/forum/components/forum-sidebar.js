import { 
  Paper, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Stack,
  Chip
} from "@mui/material";
import Iconify from "src/components/iconify";

const ForumSidebar = () => {
  const recentActivity = [
    {
      id: 1,
      user: "JohnDoe",
      action: "replied to",
      topic: "How to optimize your profile",
      time: "2 hours ago",
      avatar: "/assets/avatars/avatar_1.jpg"
    },
    {
      id: 2,
      user: "SarahSmith",
      action: "created a new topic",
      topic: "Best practices for client communication",
      time: "3 hours ago",
      avatar: "/assets/avatars/avatar_2.jpg"
    },
    {
      id: 3,
      user: "MikeJohnson",
      action: "replied to",
      topic: "Payment issues - Need urgent help",
      time: "5 hours ago",
      avatar: "/assets/avatars/avatar_3.jpg"
    },
    {
      id: 4,
      user: "Admin",
      action: "pinned",
      topic: "New feature announcement",
      time: "1 day ago",
      avatar: "/assets/avatars/avatar_admin.jpg"
    },
  ];

  const helpfulLinks = [
    { title: "Forum Guidelines", icon: "eva:file-text-outline", url: "#" },
    { title: "Community Rules", icon: "eva:shield-outline", url: "#" },
    { title: "FAQ", icon: "eva:question-mark-circle-outline", url: "#" },
    { title: "Contact Support", icon: "eva:message-circle-outline", url: "#" },
    { title: "Report Issue", icon: "eva:flag-outline", url: "#" },
  ];

  return (
    <Stack spacing={3}>
      {/* Recent Activity */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Activity
        </Typography>
        
        <Stack spacing={2}>
          {recentActivity.map((activity) => (
            <Box key={activity.id} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar
                src={activity.avatar}
                alt={activity.user}
                sx={{ width: 32, height: 32 }}
              >
                {activity.user.charAt(0)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {activity.user}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.action} "{activity.topic}"
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Helpful Links */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Helpful Links
        </Typography>
        
        <List sx={{ p: 0 }}>
          {helpfulLinks.map((link, index) => (
            <Box key={link.title}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Iconify icon={link.icon} sx={{ fontSize: 20, color: "#4CAF50" }} />
                </ListItemIcon>
                <ListItemText
                  primary={link.title}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { fontWeight: 500 }
                  }}
                />
              </ListItem>
              {index < helpfulLinks.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>

      {/* Top Contributors */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Top Contributors
        </Typography>
        
        <Stack spacing={2}>
          {[
            { name: "JohnDoe", posts: 156, avatar: "/assets/avatars/avatar_1.jpg" },
            { name: "SarahSmith", posts: 134, avatar: "/assets/avatars/avatar_2.jpg" },
            { name: "MikeJohnson", posts: 98, avatar: "/assets/avatars/avatar_3.jpg" },
            { name: "Admin", posts: 89, avatar: "/assets/avatars/avatar_admin.jpg" },
          ].map((contributor, index) => (
            <Box key={contributor.name} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={contributor.avatar}
                  alt={contributor.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {contributor.name.charAt(0)}
                </Avatar>
                {index < 3 && (
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      minWidth: 20,
                      height: 20,
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {contributor.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {contributor.posts} posts
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ForumSidebar;
