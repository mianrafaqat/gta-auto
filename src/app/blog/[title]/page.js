import { PublicPostDetailsView } from "src/sections/blog/view";

// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const { title } = params;

  // You can fetch the blog data here to generate dynamic metadata
  // For now, we'll use a basic structure
  return {
    title: `${title} - City Autos Blog`,
    description: `Read our latest blog post: ${title}`,
    openGraph: {
      title: `${title} - City Autos Blog`,
      description: `Read our latest blog post: ${title}`,
      type: "article",
      url: `/blog/${title}`,
      siteName: "City Autos",
      images: [
        {
          url: "/assets/images/blog-default.jpg", // Default blog image
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - City Autos Blog`,
      description: `Read our latest blog post: ${title}`,
      images: ["/assets/images/blog-default.jpg"],
    },
  };
}

export default function BlogDetailPage({ params }) {
  const { title } = params;

  return <PublicPostDetailsView post={title} />;
}
