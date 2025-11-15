import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Find the order
    const order = await db.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if order was created within last 30 minutes
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderTime;
    const thirtyMinutesInMs = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (timeDifference > thirtyMinutesInMs) {
      return NextResponse.json(
        { error: "Order can only be cancelled within 30 minutes of placing" },
        { status: 400 }
      );
    }

    // Check if order is already cancelled or delivered
    if (["CANCELLED", "DELIVERED", "SHIPPED"].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      );
    }

    // Delete the order and its items from database
    await db.order.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Order cancelled and deleted successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
