import ProductShopDetailsView from "src/sections/product/view/product-shop-details-view";
import { API_BASE_URL } from "src/config/app";

// ----------------------------------------------------------------------

// Helper function to strip HTML tags and decode HTML entities
function cleanDescription(htmlString) {
  if (!htmlString) return '';
  
  // Remove HTML tags
  let text = htmlString.replace(/<[^>]*>/g, ' ');
  
  // Decode common HTML entities
  text = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit to 155 characters for optimal meta description length
  if (text.length > 155) {
    text = text.substring(0, 152) + '...';
  }
  
  return text;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    // Fetch product data using native fetch for server-side rendering
    // Try slug endpoint first, fall back to ID endpoint for backward compatibility
    let response = await fetch(`${API_BASE_URL}/api/products/slug/${slug}`, {
      cache: 'no-store', // Disable caching for dynamic product data
    });

    // If slug fetch fails, try as an ID for backward compatibility
    if (!response.ok) {
      response = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
        cache: 'no-store',
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    
    // Handle different response structures
    let product = null;
    if (data?.product) {
      product = data.product;
    } else if (data?.data?.product) {
      product = data.data.product;
    } else if (data?.data) {
      product = data.data;
    } else if (data) {
      product = data;
    }

    if (product) {
      // Clean the description by removing HTML tags and entities
      const cleanDesc = cleanDescription(
        product.description || product.shortDescription
      ) || `View details for ${product.name}`;

      return {
        title: product.name || 'Product Details',
        description: cleanDesc,
        openGraph: {
          title: product.name || 'Product Details',
          description: cleanDesc,
          images: product.images && product.images.length > 0 
            ? [{ url: product.images[0] }] 
            : [],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching product metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Product Details',
    description: 'View product details and information',
  };
}

export default function ProductDetailsPage({ params }) {
  const { slug } = params;

  return <ProductShopDetailsView id={slug} />;
}
