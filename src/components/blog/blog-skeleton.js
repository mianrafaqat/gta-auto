import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

// ----------------------------------------------------------------------

const BlogSkeleton = () => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Skeleton variant="rectangular" height={240} />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={60} />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default BlogSkeleton;
