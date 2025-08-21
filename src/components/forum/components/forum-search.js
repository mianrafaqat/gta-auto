import { useState } from "react";
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  Chip, 
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import Iconify from "src/components/iconify";

const ForumSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("latest");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    handleSortClose();
  };

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most Popular" },
    { value: "replies", label: "Most Replies" },
    { value: "views", label: "Most Views" },
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper"
      }}
    >
      <Stack spacing={2}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <Iconify icon="eva:search-fill" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search topics, tags, or users..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <IconButton 
                sx={{ p: "10px" }} 
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
              >
                <Iconify icon="eva:close-fill" />
              </IconButton>
            )}
          </Paper>
        </Box>

        {/* Filters and Sort */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Quick filters:
            </Typography>
            <Chip 
              label="Unanswered" 
              size="small" 
              variant="outlined"
              sx={{ 
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": { bgcolor: "#4CAF50", color: "white" }
              }}
            />
            <Chip 
              label="My Topics" 
              size="small" 
              variant="outlined"
              sx={{ 
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": { bgcolor: "#4CAF50", color: "white" }
              }}
            />
            <Chip 
              label="Pinned" 
              size="small" 
              variant="outlined"
              sx={{ 
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": { bgcolor: "#4CAF50", color: "white" }
              }}
            />
          </Stack>

          <Box>
            <Button
              onClick={handleSortClick}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              sx={{ 
                color: "text.secondary",
                "&:hover": { color: "#4CAF50" }
              }}
            >
              Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
            </Button>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  selected={sortBy === option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ForumSearch;
