"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compare-store";
import { BsX, BsPrinter, BsShare, BsHouseDoor } from "react-icons/bs";
import { toast } from "sonner";

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Product Comparison",
        text: "Check out this product comparison",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBuyNow = (productSlug: string) => {
    window.location.href = `/products/${productSlug}`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4a23]"></div>
      </div>
    );
  }

  const maxProducts = 4;
  const emptySlots = maxProducts - items.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ef4a23]">
            <BsHouseDoor className="w-4 h-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900">Product Comparison</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Comparison</h1>
              <p className="text-gray-600">
                Find and select products to see the differences and similarities between them
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                <BsPrinter />
                Print
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[#ef4a23] text-white rounded hover:bg-[#d43f1e] transition-colors"
              >
                <BsShare />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-6">
            You can add <span className="font-semibold">Max {maxProducts} Products</span>
          </p>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {items.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 relative">
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <BsX className="text-xl" />
                </button>

                {/* Product Image */}
                <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center p-4">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-300 text-4xl">📦</div>
                  )}
                </div>

                {/* Product Info */}
                <Link
                  href={`/products/${product.slug}`}
                  className="text-[#ef4a23] hover:underline font-medium text-sm block mb-2"
                >
                  {product.name}
                </Link>

                {/* Price */}
                <div className="mb-3">
                  {product.discountPrice ? (
                    <>
                      <div className="text-xl font-bold text-[#ef4a23]">
                        {product.discountPrice.toLocaleString()}৳
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {product.price.toLocaleString()}৳
                      </div>
                    </>
                  ) : (
                    <div className="text-xl font-bold text-[#ef4a23]">
                      {product.price.toLocaleString()}৳
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Find and select product to compare</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {items.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {/* Model */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 w-48">
                      Model
                    </td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        {product.name}
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-model-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">Brand</td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        {product.brand || "N/A"}
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-brand-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">
                      Availability
                    </td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        <span
                          className={
                            product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-stock-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">Rating</td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-orange-400">
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">(0 Reviews)</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-rating-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Summary */}
                  <tr className="border-b bg-gray-50">
                    <td
                      className="py-3 px-4 font-semibold text-gray-700"
                      colSpan={maxProducts + 1}
                    >
                      Summary
                    </td>
                  </tr>

                  {/* Price */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">Price</td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        <div className="text-lg font-bold text-[#ef4a23]">
                          {(product.discountPrice || product.price).toLocaleString()}৳
                        </div>
                        {product.discountPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {product.price.toLocaleString()}৳
                          </div>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-price-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr className="border-b">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">
                      Category
                    </td>
                    {items.map((product) => (
                      <td key={product.id} className="py-3 px-4 border-l">
                        {product.category || "N/A"}
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-category-${index}`} className="py-3 px-4 border-l"></td>
                    ))}
                  </tr>

                  {/* Specifications Header */}
                  {items.some((p) => p.specifications && p.specifications.length > 0) && (
                    <tr className="border-b bg-gray-50">
                      <td
                        className="py-3 px-4 font-semibold text-gray-700"
                        colSpan={maxProducts + 1}
                      >
                        Basic Information
                      </td>
                    </tr>
                  )}

                  {/* Dynamic Specifications */}
                  {items.length > 0 &&
                    items[0].specifications &&
                    items[0].specifications.map((spec, specIndex) => (
                      <tr key={spec.key || specIndex} className="border-b">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">
                          {spec.key}
                        </td>
                        {items.map((product) => {
                          const productSpec = product.specifications?.find(
                            (s) => s.key === spec.key
                          );
                          return (
                            <td key={product.id} className="py-3 px-4 border-l">
                              {productSpec?.value || "N/A"}
                            </td>
                          );
                        })}
                        {Array.from({ length: emptySlots }).map((_, index) => (
                          <td
                            key={`empty-spec-${specIndex}-${index}`}
                            className="py-3 px-4 border-l"
                          ></td>
                        ))}
                      </tr>
                    ))}

                  {/* Buy Now Row */}
                  <tr>
                    <td className="py-4 px-4"></td>
                    {items.map((product) => (
                      <td key={product.id} className="py-4 px-4 border-l">
                        <button
                          onClick={() => handleBuyNow(product.slug)}
                          className="w-full bg-[#4a5fc4] hover:bg-[#3d4fb3] text-white py-2 rounded font-semibold transition-colors"
                        >
                          Buy Now
                        </button>
                      </td>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <td key={`empty-buy-${index}`} className="py-4 px-4 border-l"></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products to Compare</h3>
              <p className="text-gray-500 mb-6">
                Start adding products to see a detailed comparison
              </p>
              <Link
                href="/"
                className="inline-block bg-[#ef4a23] hover:bg-[#d43f1e] text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}

          {/* Clear All Button */}
          {items.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
