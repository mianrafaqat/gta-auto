import { Paper, Button, Box, Typography } from "@mui/material";
import Iconify from "src/components/iconify";

const ForumCreateButton = ({ onClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "2px dashed",
        borderColor: "#4CAF50",
        borderRadius: 2,
        bgcolor: "#4CAF5010",
        textAlign: "center",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: "#4CAF5020",
          borderColor: "#45a049",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Iconify 
        icon="eva:plus-circle-fill" 
        sx={{ 
          fontSize: 48, 
          color: "#4CAF50", 
          mb: 2 
        }} 
      />
      
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#4CAF50" }}>
        Start a New Topic
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your thoughts, ask questions, or start a discussion with the community
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<Iconify icon="eva:edit-fill" />}
        onClick={onClick}
        sx={{
          bgcolor: "#4CAF50",
          color: "white",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": {
            bgcolor: "#45a049",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
          },
        }}
      >
        Create Topic
      </Button>
    </Paper>
  );
};

export default ForumCreateButton;
