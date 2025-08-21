import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Edit post',
};

export default function PostEditPage({ params }) {
  const { title } = params;
  
  console.log("🔍 PostEditPage - Received params:", params);
  console.log("🔍 PostEditPage - Extracted title:", title);
  
  return <PostEditView title={title} />;
}
