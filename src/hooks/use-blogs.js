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
        console.log("Blog API Response:", response);
        console.log("Blog API Response Data:", response?.data);

        // Handle different response structures
        let blogs = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          blogs = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          blogs = response.data;
        } else if (Array.isArray(response)) {
          blogs = response;
        } else {
          console.warn("Unexpected response structure:", response);
          blogs = [];
        }

        return blogs;
      } catch (error) {
        console.error("Error fetching blogs:", error);
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
        console.log("Blog by ID Response:", response);

        // Handle different response structures
        let blogData = null;
        if (response?.data?.data) {
          blogData = response.data.data;
        } else if (response?.data) {
          blogData = response.data;
        } else if (response) {
          blogData = response;
        } else {
          console.warn("Unexpected response structure in getById:", response);
          blogData = null;
        }

        console.log("Final blog data:", blogData);
        return blogData;
      } catch (error) {
        console.error("Error fetching blog by ID:", error);
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
      enqueueSnackbar("Blog post updated successfully!");
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || "Failed to update blog post", {
        variant: "error",
      });
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
        } else {
          console.warn("Unexpected response structure in search:", response);
          blogs = [];
        }

        // Ensure blogs is always an array
        if (!Array.isArray(blogs)) {
          console.error("Blogs is not an array in search:", blogs);
          return [];
        }

        if (!query) return blogs;

        return blogs.filter(
          (blog) =>
            blog.title?.toLowerCase().includes(query.toLowerCase()) ||
            blog.description?.toLowerCase().includes(query.toLowerCase()) ||
            blog.content?.toLowerCase().includes(query.toLowerCase())
        );
      } catch (error) {
        console.error("Error searching blogs:", error);
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
        } else {
          console.warn("Unexpected response structure in latest:", response);
          blogs = [];
        }

        // Ensure blogs is always an array
        if (!Array.isArray(blogs)) {
          console.error("Blogs is not an array in latest:", blogs);
          return [];
        }

        return blogs.slice(0, limit);
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
        return [];
      }
    },
  });
};
