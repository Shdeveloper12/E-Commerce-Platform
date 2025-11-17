import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Search in products by name, brand, or description
    const products = await db.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                brand: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
      },
      take: 10, // Limit to 10 results for autocomplete
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Format results
    const results = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      brand: product.brand || "No Brand",
      imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
      category: product.category.name,
      stockQuantity: product.stockQuantity,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
