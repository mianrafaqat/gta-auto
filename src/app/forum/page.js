import dynamic from "next/dynamic";
import Loading from "src/app/loading";

const Forum = dynamic(() => import("src/components/forum"), {
  loading: () => <Loading />,
});

const ForumPage = () => {
  return <Forum />;
};

export default ForumPage;
