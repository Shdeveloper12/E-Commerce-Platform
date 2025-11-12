import Carousel from "@/components/ui/carousel";
import Category from "@/components/ui/category";
import Product from "@/components/ui/product";
import Service from "@/components/ui/service";
import { db } from "@/lib/db";

export default async function Home() {
  // Fetch featured products from database
  const featuredProducts = await db.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 12, // Show up to 12 featured products
  });

  // Transform database products to match the component's expected format
  const formattedProducts = featuredProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    brand: product.brand || 'No Brand',
    imageUrl: product.images[0]?.imageUrl || '/placeholder.png',
    rating: 0, // You can add rating system later
    reviews: 0, // You can add reviews later
    stockQuantity: product.stockQuantity,
    isFeatured: product.isFeatured,
    isInStock: product.stockQuantity > 0,
    category: product.category.name,
  }));

  return (
    <div>
      {/* Hero Carousel */}
      <Carousel />

      <div className="overflow-hidden bg-gray-300 py-2 container mx-auto rounded-2xl">
        <div className="animate-marquee whitespace-nowrap">
          Welcome to StarTech BD - Your one-stop shop for all tech needs!
        </div>
      </div>

      {/* Services */}
      <Service />

      {/* Categories */}
      <Category />

      {/* Featured Products */}
      <Product products={formattedProducts} />
    </div>
  );
}
