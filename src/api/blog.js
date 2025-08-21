import {
  useGetBlogs,
  useGetBlogById,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  useSearchBlogs,
  useGetLatestBlogs,
} from "src/hooks/use-blogs";

// ----------------------------------------------------------------------

export function useGetPosts() {
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    isFetching: postsValidating,
  } = useGetBlogs();

  return {
    posts: Array.isArray(posts) ? posts : [],
    postsLoading,
    postsError,
    postsValidating,
    postsEmpty: !postsLoading && (!posts || posts.length === 0),
  };
}

// ----------------------------------------------------------------------

export function useGetPost(title) {
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
    isFetching: postValidating,
  } = useGetBlogById(title);

  return {
    post,
    postLoading,
    postError,
    postValidating,
  };
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title) {
  const {
    data: latestPosts,
    isLoading: latestPostsLoading,
    error: latestPostsError,
    isFetching: latestPostsValidating,
  } = useGetLatestBlogs(5);

  return {
    latestPosts: Array.isArray(latestPosts) ? latestPosts : [],
    latestPostsLoading,
    latestPostsError,
    latestPostsValidating,
    latestPostsEmpty:
      !latestPostsLoading && (!latestPosts || latestPosts.length === 0),
  };
}

// ----------------------------------------------------------------------

export function useSearchPosts(query) {
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
    isFetching: searchValidating,
  } = useSearchBlogs(query);

  return {
    searchResults: Array.isArray(searchResults) ? searchResults : [],
    searchLoading,
    searchError,
    searchValidating,
    searchEmpty:
      !searchLoading && (!searchResults || searchResults.length === 0),
  };
}

// ----------------------------------------------------------------------

// Export the mutation hooks for creating, updating, and deleting posts
export {
  useCreateBlog as useCreatePost,
  useUpdateBlog as useUpdatePost,
  useDeleteBlog as useDeletePost,
};
