import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  Modal,
} from "@mui/material";
import Iconify from "../iconify";
import { VideoService } from "src/services";
import { useSnackbar } from "src/components/snackbar";
import { useQuery } from "@tanstack/react-query";

const getYoutubeId = (url) => {
  if (!url) return null;
  try {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
      /^[a-zA-Z0-9_-]{11}$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    console.warn("Could not extract YouTube ID from URL:", url);
    return null;
  } catch (error) {
    console.error("Error extracting YouTube ID:", error);
    return null;
  }
};

const getThumbnailUrl = (videoUrl) => {
  const videoId = getYoutubeId(videoUrl);
  if (!videoId)
    return "https://via.placeholder.com/480x360.png?text=Video+Unavailable";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export default function BrowseVideosSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // React Query hook for fetching videos
  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos", "all"],
    queryFn: async () => {
      const response = await VideoService.getAll();
      if (response?.status === 200) {
        return response.data || [];
      }
      throw new Error("Failed to fetch videos");
    },
    staleTime: Infinity, // Data will never become stale automatically
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: false, // Disable refetch on mount
    retry: 1, // Only retry once
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch videos",
        { variant: "error" }
      );
    },
  });

  // Only show loading state on initial load
  if (isLoading && !videos.length) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, minHeight: "600px" }}>
        <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>
          Loading videos...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, minHeight: "600px" }}>
        <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>
          Error loading videos. Please try again later.
        </Typography>
      </Container>
    );
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, minHeight: "600px" }}>
        <Typography variant="h6" sx={{ color: "#fff", textAlign: "center" }}>
          No videos available
        </Typography>
      </Container>
    );
  }

  const handleVideoClick = (videoUrl) => {
    console.log("Video URL:", videoUrl); // Debug log
    const videoId = getYoutubeId(videoUrl);
    console.log("Video ID:", videoId); // Debug log
    if (videoId) {
      setActiveId(videoId);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveId(null);
  };

  return (
    <Box
      maxWidth="xl"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: "600px",
      }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}>
          <Typography
            variant="h3"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: { xs: "24px", md: "32px" },
            }}>
            Browse Our Videos
          </Typography>

          <Typography
            component="a"
            href="/videos"
            sx={{
              color: "#4caf50",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                textDecoration: "underline",
              },
            }}>
            View All Videos
          </Typography>
        </Box>

        {/* Videos Grid */}
        <Grid container spacing={3}>
          {/* Large Video - Left Column */}
          {videos.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "400px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => handleVideoClick(videos[0].videoUrl)}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    background: `url(${getThumbnailUrl(videos[0].videoUrl)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      "& .play-button": {
                        transform: "translate(-50%, -50%) scale(1.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                      },
                    },
                  }}>
                  {/* Dark overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  {/* Play Button Overlay */}
                  <Box
                    className="play-button"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: { xs: "60px", md: "80px" },
                      height: { xs: "60px", md: "80px" },
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        transform: "translate(-50%, -50%) scale(1.1)",
                        border: "2px solid rgba(255, 255, 255, 1)",
                      },
                    }}>
                    <Iconify
                      icon="mdi:play"
                      sx={{
                        color: "#ffffff",
                        fontSize: { xs: "32px", md: "48px" },
                        ml: "4px", // Slight offset to visually center the play icon
                      }}
                    />
                  </Box>
                </Box>

                {/* Video Title */}
                <CardContent
                  sx={{
                    p: 2,
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                  }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "16px",
                      lineHeight: 1.3,
                    }}>
                    {videos[0].title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Smaller Videos - Right Column */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {videos.slice(1, 5).map((video) => (
                <Grid item xs={6} key={video._id}>
                  <Card
                    sx={{
                      height: "190px",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "12px",
                      // boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                        // boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleVideoClick(video.videoUrl)}>
                    <Box
                      sx={{
                        position: "relative",
                        height: "140px",
                        background: `url(${getThumbnailUrl(video.videoUrl)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          "& .play-button": {
                            transform: "translate(-50%, -50%) scale(1.1)",
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                          },
                        },
                      }}>
                      {/* Dark overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                        }}
                      />
                      {/* Play Button Overlay */}
                      <Box
                        className="play-button"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: { xs: "40px", sm: "50px" },
                          height: { xs: "40px", sm: "50px" },
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          border: "2px solid rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            transform: "translate(-50%, -50%) scale(1.1)",
                            border: "2px solid rgba(255, 255, 255, 1)",
                          },
                        }}>
                        <Iconify
                          icon="mdi:play"
                          sx={{
                            color: "#ffffff",
                            fontSize: { xs: "24px", sm: "32px" },
                            ml: "3px", // Slight offset to visually center the play icon
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Video Title */}
                    <CardContent
                      sx={{
                        p: 1.5,
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                      }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                        {video.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={isOpen}
        onClose={closeModal}
        aria-labelledby="video-modal"
        aria-describedby="youtube-video-player"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
          "& .MuiBox-root": {
            outline: "none",
          },
        }}
        disableAutoFocus>
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "800px",
            bgcolor: "transparent",
            outline: "none",
            border: "none",
            boxShadow: "none",
            overflow: "hidden",
          }}>
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%",
              width: "100%",
              backgroundColor: "transparent",
              outline: "none",
            }}>
            {activeId && (
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                }}
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
