import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        isOfferProduct: true,
        OR: [
          { offerEndDate: null },
          { offerEndDate: { gte: new Date() } },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProducts = products.map((product) => {
      const price = Number(product.price);
      const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
      const discountPercentage = discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        discountPrice,
        brand: product.brand || "Unknown",
        imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
        category: product.category.name,
        offerType: product.offerType || "REGULAR_OFFER",
        stockQuantity: product.stockQuantity,
        discountPercentage,
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers", products: [] },
      { status: 500 }
    );
  }
}
