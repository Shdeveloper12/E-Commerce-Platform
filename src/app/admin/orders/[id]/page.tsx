import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import { OrderActions } from "@/components/admin/order-actions";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
          </div>
        </div>
        <OrderActions
          orderId={order.id}
          currentStatus={order.status}
          currentPaymentStatus={order.paymentStatus}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : order.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  order.paymentStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {order.customerFirstName} {order.customerLastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="font-medium">{order.customerMobile}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{order.customerAddress}</p>
            {order.customerUpazilla && <p>{order.customerUpazilla}</p>}
            <p>{order.customerDistrict}</p>
            <p>Bangladesh</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-center py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="hover:text-blue-600"
                      >
                        {item.productName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      ${item.price.toString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${item.total.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    ${order.subtotal.toString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                    Delivery:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    ${order.deliveryCharge.toString()}
                  </td>
                </tr>
                <tr className="border-t">
                  <td
                    colSpan={3}
                    className="py-3 px-4 text-right text-lg font-bold"
                  >
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right text-lg font-bold text-blue-600">
                    ${order.totalAmount.toString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment & Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium capitalize">
              {order.paymentMethod.replace("-", " ")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery Method</p>
            <p className="font-medium capitalize">
              {order.deliveryMethod.replace("-", " ")}
            </p>
          </div>
          {order.comment && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Order Notes</p>
              <p className="font-medium">{order.comment}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
