"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import Iconify from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useSnackbar } from "src/components/snackbar";
import ForumService from "src/services/forum/forum.service";
import { useAuthContext } from "src/auth/hooks";
import {
  ForumHeader,
  ForumCategories,
  ForumTopics,
  ForumSidebar,
  ForumSearch,
  ForumStats,
  ForumCreateButton,
  ForumCreateModal,
  ForumTopicDetail,
} from "./components";

const Forum = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const isAdmin = user?.user?.role === "admin";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Default categories for fallback
  const defaultCategories = [
    { _id: "all", name: "All Topics", topicCount: 0, icon: "forum" },
  ];

  // Load categories from API
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await ForumService.getAllCategories();
      if (response?.data?.success) {
        const apiCategories = response.data.data;
        // Add "All Topics" option at the beginning
        const allCategories = [
          { _id: "all", name: "All Topics", topicCount: 0, icon: "forum" },
          ...apiCategories,
        ];
        setCategories(allCategories);
      } else {
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      enqueueSnackbar("Failed to load categories", { variant: "error" });
      setCategories(defaultCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load topics from API
  const loadTopics = async (
    page = 1,
    category = selectedCategory,
    search = searchQuery
  ) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        sort: "latest",
      };

      if (category && category !== "all") {
        params.category = category;
      }

      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response = await ForumService.getAllTopics(params);

      if (response?.data?.success) {
        const {
          topics: apiTopics,
          total,
          page: currentPage,
          totalPages,
        } = response.data.data;

        // Transform API data to match component expectations
        const transformedTopics = apiTopics.map((topic) => ({
          id: topic._id,
          title: topic.title,
          author: topic.author?.name || "Anonymous",
          authorAvatar:
            topic.author?.avatarUrl || "/assets/avatars/avatar_default.jpg",
          category: topic.category?._id || "general",
          replies: topic.commentCount || 0,
          views: topic.views || 0,
          lastActivity: formatLastActivity(topic.lastActivity),
          isPinned: topic.isPinned || false,
          isLocked: topic.isLocked || false,
          tags: topic.tags || [],
          likes: topic.likesCount || 0,
          isLiked: topic.likes?.includes(topic.author?._id) || false,
          content: topic.content,
        }));

        setTopics(transformedTopics);
        setPagination({
          page: currentPage,
          limit: pagination.limit,
          total,
          totalPages,
        });
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error("Error loading topics:", error);
      enqueueSnackbar("Failed to load topics", { variant: "error" });
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format last activity
  const formatLastActivity = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

    return date.toLocaleDateString();
  };

  useEffect(() => {
    // Load initial data
    loadCategories();
    loadTopics();
  }, []);

  // Reload topics when category or search changes
  useEffect(() => {
    if (!categoriesLoading) {
      loadTopics(1, selectedCategory, searchQuery);
    }
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Search will be triggered by useEffect
  };

  const handleCreateTopic = () => {
    setShowCreateModal(true);
  };

  const handleTopicClick = (topicId) => {
    const topic = topics.find((t) => t.id === topicId);
    setSelectedTopic(topic);
  };

  const handleCreateTopicSubmit = async (formData) => {
    try {
      const topicData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags || [],
      };

      const response = await ForumService.createTopic(topicData);

      if (response?.data?.success) {
        enqueueSnackbar("Topic created successfully!", { variant: "success" });
        setShowCreateModal(false);
        // Reload topics to show the new one
        loadTopics(1, selectedCategory, searchQuery);
        // Reload categories to update counts
        loadCategories();
      } else {
        throw new Error(response?.data?.message || "Failed to create topic");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          "Failed to create topic. Please try again.",
        {
          variant: "error",
        }
      );
    }
  };

  const handleTopicLike = async (topicId) => {
    try {
      const response = await ForumService.toggleTopicLike(topicId);

      if (response?.data?.success) {
        const { isLiked, likesCount } = response.data.data;

        setTopics(
          topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  isLiked,
                  likes: likesCount,
                }
              : topic
          )
        );
      }
    } catch (error) {
      console.error("Error toggling topic like:", error);
      enqueueSnackbar("Failed to update like", { variant: "error" });
    }
  };

  const handleTopicComment = async (topicId, comment) => {
    try {
      const response = await ForumService.createComment(topicId, {
        content: comment,
      });

      if (response?.data?.success) {
        // Update the topic's reply count
        setTopics(
          topics.map((topic) =>
            topic.id === topicId
              ? { ...topic, replies: (topic.replies || 0) + 1 }
              : topic
          )
        );

        enqueueSnackbar("Comment added successfully!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      enqueueSnackbar("Failed to add comment", { variant: "error" });
    }
  };

  const handleTopicReply = async (topicId, reply) => {
    try {
      // This will be handled in the ForumTopicDetail component
      // where we have the comment ID
      console.log("Reply to topic:", topicId, reply);
    } catch (error) {
      console.error("Error adding reply:", error);
      enqueueSnackbar("Failed to add reply", { variant: "error" });
    }
  };

  // Topics are already filtered by the API, so we just use the loaded topics
  const filteredTopics = topics;

  const handleCloseTopicDetail = () => {
    setSelectedTopic(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ForumHeader />

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            <ForumSearch onSearch={handleSearch} />

            <ForumCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              loading={categoriesLoading}
            />

            <ForumTopics
              topics={filteredTopics}
              loading={loading}
              onTopicClick={handleTopicClick}
              onLike={handleTopicLike}
            />
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <ForumStats />
            <ForumCreateButton onClick={handleCreateTopic} />
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:settings-fill" />}
                onClick={() => router.push("/dashboard/admin/forum/categories")}
                sx={{
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  "&:hover": {
                    borderColor: "#45a049",
                    bgcolor: "#4CAF5010",
                  },
                }}>
                Manage Categories
              </Button>
            )}
            <ForumSidebar />
          </Stack>
        </Grid>
      </Grid>

      {/* Create Topic Modal */}
      <ForumCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTopicSubmit}
        categories={categories}
      />

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <ForumTopicDetail
          topic={selectedTopic}
          onClose={handleCloseTopicDetail}
          onLike={handleTopicLike}
          onComment={handleTopicComment}
          onReply={handleTopicReply}
        />
      )}
    </Container>
  );
};

export default Forum;
