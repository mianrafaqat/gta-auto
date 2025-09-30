import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogService from "src/services/blog/blog.service";
import { useSnackbar } from "src/components/snackbar";

// Get all blogs
export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      try {
        const response = await BlogService.getAll();

        // Handle different response structures
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      } catch (error) {
        return [];
      }
    },
  });
};

// Get blog by ID
export const useGetBlogById = (id) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      try {
        const response = await BlogService.getById(id);

        // Handle different response structures
        if (response?.data?.data) {
          return response.data.data;
        }
        if (response?.data) {
          return response.data;
        }
        if (response) {
          return response;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    enabled: !!id,
  });
};

// Create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (blogData) => {
      const response = await BlogService.add(blogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      enqueueSnackbar("Blog post created successfully!");
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || "Failed to create blog post", {
        variant: "error",
      });
    },
  });
};

// Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, ...blogData }) => {
      const response = await BlogService.update({ id, ...blogData });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["blog", variables.id]);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update blog post";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};

// Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id) => {
      const response = await BlogService.delete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      enqueueSnackbar("Blog post deleted successfully!");
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || "Failed to delete blog post", {
        variant: "error",
      });
    },
  });
};

// Search blogs
export const useSearchBlogs = (query) => {
  return useQuery({
    queryKey: ["blogs", "search", query],
    queryFn: async () => {
      try {
        const response = await BlogService.getAll();

        // Handle different response structures
        let blogs = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          blogs = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          blogs = response.data;
        } else if (Array.isArray(response)) {
          blogs = response;
        }

        if (!Array.isArray(blogs)) return [];
        if (!query) return blogs;

        return blogs.filter(
          (blog) =>
            blog.title?.toLowerCase().includes(query.toLowerCase()) ||
            blog.description?.toLowerCase().includes(query.toLowerCase()) ||
            blog.content?.toLowerCase().includes(query.toLowerCase())
        );
      } catch (error) {
        return [];
      }
    },
    enabled: !!query,
  });
};

// Get latest blogs
export const useGetLatestBlogs = (limit = 5) => {
  return useQuery({
    queryKey: ["blogs", "latest", limit],
    queryFn: async () => {
      try {
        const response = await BlogService.getAll();

        // Handle different response structures
        let blogs = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          blogs = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          blogs = response.data;
        } else if (Array.isArray(response)) {
          blogs = response;
        }

        if (!Array.isArray(blogs)) return [];
        return blogs.slice(0, limit);
      } catch (error) {
        return [];
      }
    },
  });
};
