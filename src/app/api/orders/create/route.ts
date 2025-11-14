import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const prisma = db;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      customer,
      items,
      payment,
      delivery,
      subtotal,
      total,
      comment,
      giftVoucher,
      promoCoupon,
      starPoints,
    } = body;

    // Validation
    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    // Generate order ID and number
    const timestamp = Date.now();
    const orderId = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderNumber = `ON${timestamp}`;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderId,
        orderNumber,
        userId: session?.user?.id || null,
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerEmail: customer.email,
        customerMobile: customer.mobile,
        customerAddress: customer.address,
        customerUpazilla: customer.upazillaThana || null,
        customerDistrict: customer.district,
        paymentMethod: payment.method,
        deliveryMethod: delivery.method,
        deliveryCharge: delivery.charge,
        subtotal: subtotal,
        total: total,
        totalAmount: total,
        shippingAmount: delivery.charge,
        comment: comment || null,
        giftVoucher: giftVoucher || null,
        promoCoupon: promoCoupon || null,
        starPoints: starPoints || 0,
        status: "PENDING",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            productSlug: item.slug,
            quantity: item.quantity,
            price: item.price,
            unitPrice: item.price,
            total: item.price * item.quantity,
            totalPrice: item.price * item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Send confirmation email (optional - implement later)
    // await sendOrderConfirmationEmail(customer.email, order);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: order.orderId,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
