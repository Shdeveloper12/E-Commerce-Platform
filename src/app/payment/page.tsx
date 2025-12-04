"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface OrderDetails {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  total: number;
  orderItems: Array<{
    id: string;
    productName: string;
    quantity: number;
    total: number;
  }>;
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = `/payment${window.location.search}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && session?.user) {
      fetchOrderDetails(orderId);
    }
  }, [searchParams, session]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Failed to load order details");
      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!order) {
      toast.error("Order details not found");
      return;
    }

    setProcessing(true);

    try {
      // Handle Nagad payment
      if (paymentMethod === "nagad") {
        const response = await fetch("/api/payment/nagad/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.orderNumber,
            amount: order.total,
            customerName: customerName,
            customerPhone: session?.user?.email || "",
          }),
        });

        const data = await response.json();

        if (data.success && data.paymentUrl) {
          // Redirect to Nagad payment page
          toast.success("Redirecting to Nagad payment...");
          window.location.href = data.paymentUrl;
        } else {
          throw new Error(data.error || "Failed to initialize Nagad payment");
        }
      } 
      // Handle bKash payment
      else if (paymentMethod === "bkash") {
        toast.info("bKash integration coming soon!");
        setProcessing(false);
      }
      // Handle other payment methods
      else {
        // Simulate payment processing for other methods
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Payment processed successfully!");
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5fc4]"></div>
      </div>
    );
  }

  if (!order) return null;

  const customerName = `${order.customerFirstName} ${order.customerLastName}`;
  const dueAmount = order.total; // Assuming full amount is due

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>

          <div className="space-y-6">
            {/* Order ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={order.orderNumber}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                value={customerName}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>

            {/* Due Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Due
              </label>
              <input
                type="text"
                value={dueAmount.toLocaleString()}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Payment
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a5fc4] focus:border-transparent"
              >
                <option value="">--- Please Select ---</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="upay">Upay</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing || !paymentMethod}
              className="w-full bg-[#4a5fc4] hover:bg-[#3d4fb3] text-white py-3 rounded-md font-semibold text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                "Pay"
              )}
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Products</h2>

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
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 font-medium">{item.productName}</p>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-6 border-t">
            <button
              onClick={() => router.push("/account/orders")}
              className="px-8 py-3 border-2 border-[#4a5fc4] text-[#4a5fc4] rounded font-semibold hover:bg-[#4a5fc4] hover:text-white transition-colors"
            >
              Continue
            </button>
            <button
              onClick={handlePayment}
              disabled={processing || !paymentMethod}
              className="px-8 py-3 bg-[#4a5fc4] text-white rounded font-semibold hover:bg-[#3d4fb3] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
