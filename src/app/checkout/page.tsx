"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useCartStore } from "@/store/cart-store";

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  mobile: string;
  email: string;
  upazillaThana: string;
  district: string;
  comment: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { items: cartItems, clearCart, getTotalPrice } = useCartStore();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    email: "",
    upazillaThana: "",
    district: "Dhaka - City",
    comment: "",
  });

  // Payment & Delivery
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [deliveryMethod, setDeliveryMethod] = useState("home-delivery");
  const [giftVoucher, setGiftVoucher] = useState("");
  const [promoCoupon, setPromoCoupon] = useState("");
  const [starPoints, setStarPoints] = useState(0);

  // Delivery charges
  const deliveryCharges = {
    "home-delivery": 60,
    "store-pickup": 0,
    "request-express": 300,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Pre-fill user data if logged in
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const calculateSubtotal = () => {
    return getTotalPrice();
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = deliveryCharges[deliveryMethod as keyof typeof deliveryCharges];
    return subtotal + delivery;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 11) {
      toast.error("Valid mobile number is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return false;
    }
    if (!agreeTerms) {
      toast.error("Please agree to Terms and Conditions");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          upazillaThana: formData.upazillaThana,
          district: formData.district,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          slug: item.slug,
          price: item.discountPrice || item.price || 0,
          quantity: item.quantity,
          image: item.imageUrl,
        })),
        payment: {
          method: paymentMethod,
        },
        delivery: {
          method: deliveryMethod,
          charge: deliveryCharges[deliveryMethod as keyof typeof deliveryCharges],
        },
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        comment: formData.comment,
        giftVoucher,
        promoCoupon,
        starPoints,
      };

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Store order details for success page
        const orderSuccessData = {
          orderId: result.order.id,
          orderNumber: result.order.orderNumber,
          subtotal: calculateSubtotal(),
          deliveryCharge: deliveryCharges[deliveryMethod as keyof typeof deliveryCharges],
          total: calculateTotal(),
          amountPaid: 0,
          due: calculateTotal(),
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerAddress: formData.address,
          customerDistrict: formData.district,
          customerUpazilla: formData.upazillaThana,
          customerMobile: formData.mobile,
          deliveryMethod: deliveryMethod,
          paymentMethod: paymentMethod,
        };
        
        localStorage.setItem("lastOrder", JSON.stringify(orderSuccessData));
        
        // Clear cart from Zustand store
        clearCart();

        // Redirect to order success page
        router.push(`/order-success?orderId=${result.order.id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to checkout</p>
        <Link
          href="/category/all"
          className="bg-[#ef4a23] text-white px-6 py-3 rounded hover:bg-[#d43f1e] transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-[#ef4a23]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#ef4a23]">
            Shopping Cart
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Alert Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-sm text-blue-800">
          কার্যদিবস সকাল ১১টার মধ্যে পণ্য অর্ডার করলে, ঢাকা সিটির ভিতরে আজই পৌছাঁবে অন্যথায় পরবর্তী কার্যদিবস পৌছাঁবে সারাদেশে।
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-[#ef4a23] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Customer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="Last Name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="01707019394"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upazilla/Thana</label>
                  <input
                    type="text"
                    name="upazillaThana"
                    value={formData.upazillaThana}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="Upazilla/Thana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                  >
                    <option>Dhaka - City</option>
                    <option>Dhaka - Suburb</option>
                    <option>Chittagong</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                    <option>Sylhet</option>
                    <option>Barisal</option>
                    <option>Rangpur</option>
                    <option>Mymensingh</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-[#ef4a23] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Payment Method
              </h2>
              <p className="text-sm text-gray-600 mb-4">Select a payment method</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash-on-delivery"
                    checked={paymentMethod === "cash-on-delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online-payment"
                    checked={paymentMethod === "online-payment"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">Online Payment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pos-on-delivery"
                    checked={paymentMethod === "pos-on-delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">POS on Delivery</span>
                </label>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium mb-2">We accept:</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs bg-white px-2 py-1 rounded border">CASH ON DELIVERY</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">VISA</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">MasterCard</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">bKash</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">Nagad</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">Rocket</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border">TapalPay</span>
                </div>
              </div>

              {/* Vouchers */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={giftVoucher}
                      onChange={(e) => setGiftVoucher(e.target.value)}
                      placeholder="Gift Voucher"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    />
                    <button className="px-4 py-2 bg-[#ef4a23] text-white rounded hover:bg-[#d43f1e] transition">
                      Apply Voucher
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCoupon}
                      onChange={(e) => setPromoCoupon(e.target.value)}
                      placeholder="Promo / Coupon Code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                    />
                    <button className="px-4 py-2 bg-[#ef4a23] text-white rounded hover:bg-[#d43f1e] transition">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>

              {/* Star Points */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={starPoints}
                    onChange={(e) => setStarPoints(Number(e.target.value))}
                    placeholder="Points to use (Max 0)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#ef4a23]"
                  />
                  <button className="px-4 py-2 bg-[#ef4a23] text-white rounded hover:bg-[#d43f1e] transition">
                    Apply Points
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-[#ef4a23] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Delivery Method
              </h2>
              <p className="text-sm text-gray-600 mb-4">Select a delivery method</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="home-delivery"
                    checked={deliveryMethod === "home-delivery"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">Home Delivery - 60৳</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="store-pickup"
                    checked={deliveryMethod === "store-pickup"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">Store Pickup - 0৳</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="request-express"
                    checked={deliveryMethod === "request-express"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-4 h-4 text-[#ef4a23]"
                  />
                  <span className="font-medium">Request Express - 300৳</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-[#ef4a23] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                Order Overview
              </h2>

              {/* Product List */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {(((item.discountPrice || item.price) || 0) * item.quantity).toLocaleString()}৳
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub-Total:</span>
                  <span className="font-semibold text-[#ef4a23]">
                    {calculateSubtotal().toLocaleString()}৳
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Home Delivery:</span>
                  <span className="font-semibold text-[#ef4a23]">
                    {deliveryCharges[deliveryMethod as keyof typeof deliveryCharges]}৳
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-bold">
                  <span>Total:</span>
                  <span className="text-[#ef4a23]">
                    {calculateTotal().toLocaleString()}৳
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Confirm Button */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#ef4a23]"
            />
            <span className="text-sm">
              I have read and agree to the{" "}
              <Link href="/terms" className="text-[#ef4a23] hover:underline">
                Terms and Conditions
              </Link>
              ,{" "}
              <Link href="/privacy" className="text-[#ef4a23] hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/refund" className="text-[#ef4a23] hover:underline">
                Refund and Return Policy
              </Link>
            </span>
          </label>

          <button
            onClick={handleConfirmOrder}
            disabled={loading || !agreeTerms}
            className="w-full md:w-auto px-8 py-3 bg-[#ef4a23] text-white font-semibold rounded hover:bg-[#d43f1e] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
