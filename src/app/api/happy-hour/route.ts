import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        isOfferProduct: true,
        offerType: "HAPPY_HOUR",
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
      take: 20,
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
        stockQuantity: product.stockQuantity,
        discountPercentage,
        offerEndDate: product.offerEndDate?.toISOString(),
      };
    });

    // Set end time to end of today
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    return NextResponse.json({ 
      products: formattedProducts,
      endTime: endTime.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching happy hour products:", error);
    return NextResponse.json(
      { error: "Failed to fetch happy hour products", products: [] },
      { status: 500 }
    );
  }
}
