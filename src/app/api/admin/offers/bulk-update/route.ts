import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productIds, offerType, discountPercentage, offerStartDate, offerEndDate } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Invalid product IDs" }, { status: 400 });
    }

    if (!discountPercentage || discountPercentage <= 0 || discountPercentage >= 100) {
      return NextResponse.json({ error: "Invalid discount percentage" }, { status: 400 });
    }

    // Get all products
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Update each product with offer
    const updatePromises = products.map((product) => {
      const originalPrice = Number(product.price);
      const discountAmount = originalPrice * (discountPercentage / 100);
      const newDiscountPrice = originalPrice - discountAmount;

      return db.product.update({
        where: { id: product.id },
        data: {
          isOfferProduct: true,
          offerType,
          discountPrice: newDiscountPrice,
          offerStartDate: offerStartDate ? new Date(offerStartDate) : null,
          offerEndDate: offerEndDate ? new Date(offerEndDate) : null,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      success: true,
      message: `Offer applied to ${productIds.length} products`,
    });
  } catch (error) {
    console.error("Error applying bulk offer:", error);
    return NextResponse.json(
      { error: "Failed to apply offer" },
      { status: 500 }
    );
  }
}
