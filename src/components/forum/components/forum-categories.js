import {
  Box,
  Chip,
  Stack,
  Typography,
  useTheme,
  Skeleton,
} from "@mui/material";
import Iconify from "src/components/iconify";

const ForumCategories = ({
  categories,
  selectedCategory,
  onCategoryChange,
  loading = false,
}) => {
  const theme = useTheme();

  const getCategoryIcon = (iconName) => {
    const iconMap = {
      forum: "eva:message-circle-fill",
      chat: "eva:message-square-fill",
      help: "eva:question-mark-circle-fill",
      feedback: "eva:edit-fill",
      announcement: "eva:bell-fill",
      event: "eva:calendar-fill",
      lightbulb: "eva:bulb-fill",
    };
    return iconMap[iconName] || "eva:folder-fill";
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h2"  sx={{ mb: 2, fontWeight: 600, color: "#4CAF50" }}>
          Categories
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={120}
              height={32}
              sx={{ borderRadius: 16 }}
            />
          ))}
        </Stack>
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#4CAF50" }}>
          Categories
        </Typography>
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.neutral",
          }}>
          <Iconify
            icon="eva:folder-outline"
            sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Categories Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Categories need to be created before topics can be posted.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() =>
              (window.location.href = "/dashboard/admin/forum/categories")
            }
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": { bgcolor: "#45a049" },
            }}>
            Create Categories
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#4CAF50" }}>
        Categories
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}>
        {categories.map((category) => (
          <Chip
            key={category._id}
            icon={<Iconify icon={getCategoryIcon(category.icon)} />}
            label={`${category.name} (${category.topicCount || 0})`}
            onClick={() => onCategoryChange(category._id)}
            variant={selectedCategory === category._id ? "filled" : "outlined"}
            sx={{
              borderColor:
                selectedCategory === category._id ? "#4CAF50" : "#4CAF50",
              bgcolor:
                selectedCategory === category._id ? "#4CAF50" : "transparent",
              color:
                selectedCategory === category._id ? "white" : "#4CAF50",
              fontWeight: selectedCategory === category._id ? 600 : 400,
              "&:hover": {
                bgcolor:
                  selectedCategory === category._id ? "#45a049" : "#f5f5f5",
                borderColor: "#4CAF50",
              },
              "& .MuiChip-icon": {
                color: selectedCategory === category._id ? "white" : "#4CAF50",
              },
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ForumCategories;
