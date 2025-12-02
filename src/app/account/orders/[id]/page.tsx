"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BsBoxSeam, BsHouseDoor, BsListUl } from "react-icons/bs";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface OrderItem {
  id: string;
  productName: string;
  productSlug: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  createdAt: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  customerUpazilla?: string;
  customerDistrict: string;
  deliveryMethod: string;
  paymentMethod: string;
  orderItems: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && params.id) {
      fetchOrderDetails();
    }
  }, [session, params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        
        // Check if order can be cancelled (within 30 minutes and not already cancelled/delivered/shipped)
        const orderTime = new Date(data.order.createdAt).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - orderTime;
        const thirtyMinutesInMs = 30 * 60 * 1000;
        
        const isCancellable = 
          timeDifference <= thirtyMinutesInMs && 
          !["CANCELLED", "DELIVERED", "SHIPPED"].includes(data.order.status);
        
        setCanCancel(isCancellable);
      } else {
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Order",
      cancelButtonText: "No, Keep Order",
    });

    if (result.isConfirmed) {
      setCancelling(true);
      try {
        const response = await fetch(`/api/orders/${params.id}/cancel`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Order cancelled successfully");
          
          await Swal.fire({
            title: "Cancelled!",
            text: "Your order has been cancelled and removed from your order history.",
            icon: "success",
            confirmButtonColor: "#ef4a23",
          });
          
          // Redirect to orders page since order is deleted
          router.push("/account/orders");
        } else {
          toast.error(data.error || "Failed to cancel order");
          Swal.fire({
            title: "Error!",
            text: data.error || "Failed to cancel order",
            icon: "error",
            confirmButtonColor: "#ef4a23",
          });
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error("Failed to cancel order");
        Swal.fire({
          title: "Error!",
          text: "Failed to cancel order. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4a23",
        });
      } finally {
        setCancelling(false);
      }
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4a23]"></div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: "bg-orange-500",
      CONFIRMED: "bg-blue-500",
      PROCESSING: "bg-purple-500",
      SHIPPED: "bg-indigo-500",
      DELIVERED: "bg-green-500",
      CANCELLED: "bg-red-500",
      REFUNDED: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const deliveryMethodLabel =
    order.deliveryMethod === "home-delivery"
      ? "Home Delivery"
      : order.deliveryMethod === "store-pickup"
      ? "Store Pickup"
      : "Express Delivery";

  const paidAmount = 0; // You can get this from payment records
  const dueAmount = order.total - paidAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ef4a23]">
            <BsHouseDoor className="w-4 h-4" />
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-[#ef4a23]">
            Account
          </Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-[#ef4a23]">
            Order History
          </Link>
          <span>/</span>
          <span className="text-gray-900">Order Information</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Order Header */}
              <div className="text-center mb-6 pb-6 border-b">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Order Information
                </h1>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  #{order.orderNumber}
                </p>
                <span
                  className={`inline-block px-4 py-1 rounded text-white text-sm font-semibold ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Shipping Address & Order Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                {/* Shipping Address */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Shipping Address</h2>
                  <div className="space-y-1 text-gray-700 italic">
                    <p className="font-semibold not-italic">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                    <p>
                      {order.customerAddress}, {order.customerDistrict}, Bangladesh
                    </p>
                    {order.customerUpazilla && <p>{order.customerUpazilla}</p>}
                    <p>{order.customerDistrict}</p>
                    <p>Bangladesh</p>
                    <p className="mt-3 not-italic">
                      <span className="font-semibold">Mobile:</span> {order.customerMobile}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Sub-Total</span>
                      <span className="font-semibold">{order.subtotal.toLocaleString()}৳</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>{deliveryMethodLabel}</span>
                      <span className="font-semibold">{order.deliveryCharge}৳</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>{order.total.toLocaleString()}৳</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Paid</span>
                      <span className="font-semibold text-green-600">{paidAmount}৳</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Due</span>
                      <span className="text-red-600">{dueAmount.toLocaleString()}৳</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Products</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Image
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Product Name
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <BsBoxSeam className="text-gray-400 text-2xl" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              href={`/products/${item.productSlug}`}
                              className="text-gray-900 hover:text-[#ef4a23] font-medium"
                            >
                              {item.productName}
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">
                            {item.total.toLocaleString()}৳
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 pt-6 border-t">
                {/* Cancel Order Button - Only shows within 30 minutes */}
                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="px-8 py-3 border-2 border-red-500 text-red-500 rounded font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
                
                {/* Payment Buttons */}
                {dueAmount > 0 && order.status !== "CANCELLED" && (
                  <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto">
                    <button
                      onClick={() => router.push("/account/orders")}
                      className="px-8 py-3 border-2 border-[#4a5fc4] text-[#4a5fc4] rounded font-semibold hover:bg-[#4a5fc4] hover:text-white transition-colors"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => router.push(`/payment?orderId=${order.id}`)}
                      className="px-8 py-3 bg-[#4a5fc4] text-white rounded font-semibold hover:bg-[#3d4fb3] transition-colors"
                    >
                      Pay Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order History Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
