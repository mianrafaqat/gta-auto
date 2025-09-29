import CategoryView from "src/sections/category/view/category-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Category | GTA Auto",
};

export default function CategoryPage({ params }) {
  const { slug } = params;

  return <CategoryView categorySlug={slug} />;
}
