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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Remove offer from product
    await db.product.update({
      where: { id: productId },
      data: {
        isOfferProduct: false,
        offerType: null,
        discountPrice: null,
        offerStartDate: null,
        offerEndDate: null,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Offer removed successfully",
    });
  } catch (error) {
    console.error("Error removing offer:", error);
    return NextResponse.json(
      { error: "Failed to remove offer" },
      { status: 500 }
    );
  }
}
