import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user orders
    const orders = await db.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          select: {
            id: true,
            productName: true,
            productSlug: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number for JSON serialization
    const ordersData = orders.map(order => ({
      ...order,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      totalAmount: Number(order.totalAmount),
      deliveryCharge: Number(order.deliveryCharge),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      })),
    }));

    return NextResponse.json(
      { 
        success: true,
        orders: ordersData 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
