"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BsTrash, BsArrowLeft } from "react-icons/bs";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items: cartItems, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug: Log cart items when they change
  useEffect(() => {
    console.log("🛒 Cart items updated:", cartItems);
    console.log("📦 Total items:", cartItems.length);
  }, [cartItems]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    toast.success("Cart updated");
  };

  const handleCheckout = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.error("Please login to continue checkout");
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const calculateSubtotal = () => {
    return getTotalPrice();
  };

  // Prevent hydration mismatch by only rendering after client mount
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-gray-200 rounded mx-auto mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="w-32 h-32 mx-auto mb-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Start adding products to your cart
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#ef4a23] text-white px-6 py-3 rounded hover:bg-[#d43f1e] transition"
          >
            <BsArrowLeft />
            Continue Shopping
          </Link>
        </div>
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
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold hover:text-[#ef4a23] line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[#ef4a23] font-bold mt-2">
                    {((item.discountPrice || item.price) || 0).toLocaleString()}৳
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                    >
                      <BsTrash />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {(((item.discountPrice || item.price) || 0) * item.quantity).toLocaleString()}৳
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 transition text-sm"
            >
              Clear All Items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {calculateSubtotal().toLocaleString()}৳
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">60৳</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#ef4a23]">
                    {(calculateSubtotal() + 60).toLocaleString()}৳
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="block w-full mt-6 bg-[#ef4a23] text-white text-center py-3 rounded font-semibold hover:bg-[#d43f1e] transition"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block w-full mt-3 border border-gray-300 text-gray-700 text-center py-3 rounded font-semibold hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
