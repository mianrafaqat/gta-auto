import { Paper, Button, Box, Typography } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useAuthContext } from "src/auth/hooks";
import Iconify from "src/components/iconify";

const ForumCreateButton = ({ onClick }) => {
  const router = useRouter();
  const { authenticated, user } = useAuthContext();

  // Check if user is authenticated
  const isAuthenticated = authenticated && user?.user?._id;

  const handleLoginClick = () => {
    router.push(paths.auth.jwt.login);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "2px dashed",
        borderColor: isAuthenticated ? "#4CAF50" : "#FF9800",
        borderRadius: 2,
        bgcolor: isAuthenticated ? "#4CAF5010" : "#FF980010",
        textAlign: "center",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: isAuthenticated ? "#4CAF5020" : "#FF980020",
          borderColor: isAuthenticated ? "#45a049" : "#F57C00",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Iconify 
        icon={isAuthenticated ? "eva:plus-circle-fill" : "eva:lock-fill"} 
        sx={{ 
          fontSize: 48, 
          color: isAuthenticated ? "#4CAF50" : "#FF9800", 
          mb: 2 
        }} 
      />
      
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: isAuthenticated ? "#4CAF50" : "#FF9800" }}>
        {isAuthenticated ? "Start a New Topic" : "Login to Create Topic"}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {isAuthenticated 
          ? "Share your thoughts, ask questions, or start a discussion with the community"
          : "Please log in to your account to create and participate in forum discussions"
        }
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<Iconify icon={isAuthenticated ? "eva:edit-fill" : "eva:log-in-fill"} />}
        onClick={isAuthenticated ? onClick : handleLoginClick}
        sx={{
          bgcolor: isAuthenticated ? "#4CAF50" : "#FF9800",
          color: "white",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": {
            bgcolor: isAuthenticated ? "#45a049" : "#F57C00",
            transform: "translateY(-1px)",
            boxShadow: isAuthenticated 
              ? "0 4px 12px rgba(76, 175, 80, 0.3)"
              : "0 4px 12px rgba(255, 152, 0, 0.3)",
          },
        }}
      >
        {isAuthenticated ? "Create Topic" : "Login"}
      </Button>
    </Paper>
  );
};

export default ForumCreateButton;
