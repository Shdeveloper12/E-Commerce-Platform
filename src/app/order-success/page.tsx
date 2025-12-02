"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BsCheckCircleFill } from "react-icons/bs";

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  amountPaid: number;
  due: number;
  customerName: string;
  customerAddress: string;
  customerDistrict: string;
  customerUpazilla?: string;
  customerMobile: string;
  deliveryMethod: string;
  paymentMethod: string;
}

function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    
    if (!orderId) {
      router.push("/");
      return;
    }

    // Fetch order details from localStorage (temporary storage from checkout)
    const storedOrder = localStorage.getItem("lastOrder");
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
      setLoading(false);
    } else {
      // If no stored order, redirect to home
      router.push("/");
    }
  }, [searchParams, router]);

  const handlePayNow = () => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      router.push(`/payment?orderId=${orderId}`);
    }
  };

  const handlePayLater = () => {
    // Clear last order and redirect to orders page
    localStorage.removeItem("lastOrder");
    router.push("/account/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4a23]"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const deliveryMethodLabel =
    orderDetails.deliveryMethod === "home-delivery"
      ? "Home Delivery"
      : orderDetails.deliveryMethod === "store-pickup"
      ? "Store Pickup"
      : "Express Delivery";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <BsCheckCircleFill className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your order has been placed!
          </h1>
          <p className="text-gray-700 text-lg">
            Your order <span className="font-bold text-[#ef4a23]">#{orderDetails.orderNumber}</span> has
            been placed successfully. Should you have any questions about your order, feel free to call
            us on{" "}
            <a href="tel:01862693538" className="text-[#ef4a23] font-semibold">
            01862693538
            </a>{" "}
            (10 AM - 5 PM).
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Delivery Address */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{orderDetails.customerName}</p>
                <p>{orderDetails.customerAddress}</p>
                {orderDetails.customerUpazilla && (
                  <p>{orderDetails.customerUpazilla}</p>
                )}
                <p>{orderDetails.customerDistrict}</p>
                <p>Bangladesh</p>
                <p className="mt-4">
                  <span className="font-semibold">Mobile:</span> {orderDetails.customerMobile}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Sub-Total</span>
                  <span className="font-semibold">{orderDetails.subtotal.toLocaleString()}৳</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{deliveryMethodLabel}</span>
                  <span className="font-semibold">{orderDetails.deliveryCharge}৳</span>
                </div>
                <div className="flex justify-between text-gray-900 text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{orderDetails.total.toLocaleString()}৳</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Amount Paid</span>
                  <span className="font-semibold text-green-600">{orderDetails.amountPaid}৳</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Due</span>
                  <span className="text-red-600">{orderDetails.due.toLocaleString()}৳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Notice */}
          {orderDetails.due > 0 && orderDetails.paymentMethod === "cash-on-delivery" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Want to Pay Now? Please read carefully
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                After payment before agent confirmation, some products may not be delivered due to
                stock problems. To get refund, refund charge will be applicable and it will take 5 to
                15 working days to process the refund. So we are encouraging you to pay after our
                agent's confirmation to avoid any inconveniences.
              </p>

              {/* Payment Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={handlePayNow}
                  className="px-8 py-3 border-2 border-[#ef4a23] text-[#ef4a23] rounded font-semibold hover:bg-[#ef4a23] hover:text-white transition-colors"
                >
                  Pay Now
                </button>
                <button
                  onClick={handlePayLater}
                  className="px-8 py-3 bg-[#ef4a23] text-white rounded font-semibold hover:bg-[#d43f1e] transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </div>
          )}

          {/* Already Paid */}
          {orderDetails.due === 0 && (
            <div className="border-t pt-6 text-center">
              <p className="text-green-600 font-semibold text-lg mb-4">
                Payment completed successfully!
              </p>
              <Link
                href="/account/orders"
                className="inline-block px-8 py-3 bg-[#ef4a23] text-white rounded font-semibold hover:bg-[#d43f1e] transition-colors"
              >
                View My Orders
              </Link>
            </div>
          )}
        </div>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#ef4a23] hover:underline font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <OrderSuccessPageContent />
    </Suspense>
  );
}
