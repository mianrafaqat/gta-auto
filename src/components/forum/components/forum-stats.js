import { Paper, Box, Typography, Grid, Stack } from "@mui/material";
import Iconify from "src/components/iconify";

const ForumStats = () => {
  const stats = [
    {
      label: "Total Topics",
      value: "1,250",
      icon: "eva:message-circle-outline",
      color: "#4CAF50",
    },
    {
      label: "Total Replies",
      value: "5,680",
      icon: "eva:message-square-outline",
      color: "#2196F3",
    },
    {
      label: "Active Users",
      value: "890",
      icon: "eva:people-outline",
      color: "#FF9800",
    },
    {
      label: "New Today",
      value: "23",
      icon: "eva:plus-circle-outline",
      color: "#9C27B0",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Community Stats
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={6} key={stat.label}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: "background.neutral",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <Iconify icon={stat.icon} sx={{ fontSize: 20 }} />
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: "#4CAF50", borderRadius: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="eva:trending-up-outline" sx={{ fontSize: 24, color: "white" }} />
          <Box>
            <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
              Community Growth
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
              +12% this month
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ForumStats;
