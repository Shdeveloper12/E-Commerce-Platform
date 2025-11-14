import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    // Fetch order details
    const order = await db.order.findFirst({
      where: {
        id: orderId,
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
            unitPrice: true,
            total: true,
            totalPrice: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Convert Decimal to number for JSON serialization
    const orderData = {
      ...order,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      totalAmount: Number(order.totalAmount),
      deliveryCharge: Number(order.deliveryCharge),
      discountAmount: Number(order.discountAmount),
      shippingAmount: Number(order.shippingAmount),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        order: orderData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
