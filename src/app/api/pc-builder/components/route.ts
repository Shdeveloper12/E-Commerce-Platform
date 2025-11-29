import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const COMPONENT_TYPE_TO_CATEGORY: Record<string, string[]> = {
  CPU: ["processor", "cpu"],
  MOTHERBOARD: ["motherboard"],
  RAM: ["ram", "memory"],
  GPU: ["graphics-card", "gpu"],
  STORAGE: ["ssd", "hard-disk-drive", "portable-ssd"],
  PSU: ["power-supply"],
  CASE: ["casing"],
  COOLER: ["cpu-cooler", "water-cooling"],
  MONITOR: ["monitor", "gaming-monitor"],
  KEYBOARD: ["keyboard", "gaming-keyboard"],
  MOUSE: ["mouse", "gaming-mouse"],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const componentType = searchParams.get("type");

    if (!componentType) {
      return NextResponse.json(
        { error: "Component type is required" },
        { status: 400 }
      );
    }

    // Get category slugs for this component type
    const categorySlugs = COMPONENT_TYPE_TO_CATEGORY[componentType] || [];

    if (categorySlugs.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Find categories
    const categories = await db.category.findMany({
      where: {
        slug: { in: categorySlugs },
        isActive: true,
      },
      select: { id: true },
    });

    const categoryIds = categories.map((c) => c.id);

    // Find products in these categories
    const products = await db.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        isActive: true,
        stockQuantity: { gt: 0 },
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.discountPrice || product.price),
      imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
      brand: product.brand || "Unknown",
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching PC builder components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components", products: [] },
      { status: 500 }
    );
  }
}
