
import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post details | Dashboard - ` };

export default async function Page({ params }) {
  const { title } = params;


  return <PostDetailsView post={title} />;
}

// ----------------------------------------------------------------------



/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = 'auto';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  try {
    // Import the blog service
    const BlogService = (await import('src/services/blog/blog.service')).default;
    
    // Get all posts to generate static params
    const allPostsResponse = await BlogService.getAll();
    
    // Handle different response structures
    let allPosts = [];
    if (allPostsResponse?.data?.data && Array.isArray(allPostsResponse.data.data)) {
      allPosts = allPostsResponse.data.data;
    } else if (allPostsResponse?.data && Array.isArray(allPostsResponse.data)) {
      allPosts = allPostsResponse.data;
    } else if (Array.isArray(allPostsResponse)) {
      allPosts = allPostsResponse;
    }
    
    // Ensure allPosts is always an array
    if (!Array.isArray(allPosts)) {
      console.warn('allPosts is not an array:', allPosts);
      return [];
    }
    
    return allPosts.map((post) => ({
      title: post.title || post._id || 'default',
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
