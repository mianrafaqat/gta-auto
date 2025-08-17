import { PostDetailsView } from "src/sections/blog/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Blog Post Details",
};

export default function BlogDetailPage({ params }) {
  const { title } = params;

  return <PostDetailsView post={title} />;
}
