import { useState, useEffect } from "react";
import { Paper, Box, Typography, Grid, Stack, Skeleton } from "@mui/material";
import Iconify from "src/components/iconify";
import ForumService from "src/services/forum/forum.service";

const ForumStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [growthPercentage, setGrowthPercentage] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await ForumService.getStats();
        if (response?.data?.success) {
          setStatsData(response.data.data);
          // Calculate growth percentage if available
          if (response.data.data.growthPercentage !== undefined) {
            setGrowthPercentage(response.data.data.growthPercentage);
          }
        }
      } catch (error) {
        console.error("Error fetching forum stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num?.toString() || "0";
  };

  const stats = [
    {
      label: "Total Topics",
      value: statsData?.totalTopics || 0,
      icon: "eva:message-circle-outline",
      color: "#4CAF50",
    },
    {
      label: "Total Replies",
      value: statsData?.totalComments || 0,
      icon: "eva:message-square-outline",
      color: "#2196F3",
    },
    {
      label: "Active Users",
      value: statsData?.activeUsers || 0,
      icon: "eva:people-outline",
      color: "#FF9800",
    },
    {
      label: "New Today",
      value: statsData?.newToday || 0,
      icon: "eva:plus-circle-outline",
      color: "#9C27B0",
    },
  ];

  if (loading) {
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
          {[...Array(4)].map((_, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "background.neutral",
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={70} sx={{ borderRadius: 1 }} />
        </Box>
      </Paper>
    );
  }

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
                  {formatNumber(stat.value)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {statsData && (
        <Box sx={{ mt: 3, p: 2, bgcolor: "#4CAF50", borderRadius: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify 
              icon={growthPercentage >= 0 ? "eva:trending-up-outline" : "eva:trending-down-outline"} 
              sx={{ fontSize: 24, color: "white" }} 
            />
            <Box>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                Community Growth
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {growthPercentage >= 0 ? "+" : ""}{growthPercentage}% this month
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default ForumStats;
