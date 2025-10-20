import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";

const ForumHeader = () => {
  const router = useRouter();

  const handleBreadcrumbClick = (path) => {
    router.push(path);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 1, 
          fontWeight: 700, 
          color: "#4CAF50",
          textAlign: "center"
        }}
      >
        Community Forum
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: "text.secondary", 
          textAlign: "center",
          maxWidth: 600,
          mx: "auto"
        }}
      >
        Connect with fellow members, share experiences, and get help from our community
      </Typography>

      {/* <Breadcrumbs 
        separator={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ 
          justifyContent: "center",
          "& .MuiBreadcrumbs-separator": {
            color: "text.secondary"
          }
        }}
      >
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleBreadcrumbClick(paths.dashboard.root);
          }}
          sx={{ 
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" }
          }}
        >
          Home
        </Link>
        <Typography color="text.primary">Forum</Typography>
      </Breadcrumbs> */}
    </Box>
  );
};

export default ForumHeader;
