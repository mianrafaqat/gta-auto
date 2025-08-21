import dynamic from "next/dynamic";
import Loading from "src/app/loading";

const Blog = dynamic(() => import("src/components/blog"), {
  loading: () => <Loading />,
});

const BlogPage = () => {
  return <Blog />;
};

export default BlogPage;
