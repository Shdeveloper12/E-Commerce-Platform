"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiSolidOffer } from "react-icons/bi";
import { motion } from "motion/react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

interface OfferProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  brand: string;
  imageUrl: string;
  category: string;
  offerType: string;
  stockQuantity: number;
  discountPercentage?: number;
}

export default function OffersPage() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const { addItem } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();

  useEffect(() => {
    async function fetchOfferProducts() {
      try {
        const response = await fetch("/api/offers");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    }

    fetchOfferProducts();
  }, []);

  const filteredProducts = filter === "ALL" 
    ? products 
    : products.filter(p => p.offerType === filter);

  const handleAddToCart = (product: OfferProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = (product: OfferProduct) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    toast.success("Added to wishlist!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <BiSolidOffer className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Special Offers & Deals
            </h1>
            <p className="text-lg md:text-xl text-orange-100">
              Save big on your favorite tech products!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {["ALL", "REGULAR_OFFER", "FLASH_SALE", "SEASONAL_SALE", "CLEARANCE"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === filterType
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-orange-100 border border-gray-300"
              }`}
            >
              {filterType.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading amazing offers...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    {product.discountPercentage}% OFF
                  </div>
                )}

                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 hover:text-orange-600 line-clamp-2 h-12">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.brand && (
                    <p className="text-xs text-gray-600 mb-2">Brand: {product.brand}</p>
                  )}

                  {/* Price */}
                  <div className="mb-3">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-2xl font-bold text-orange-600">
                          ৳{product.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">
                        ৳{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {product.stockQuantity > 0 ? (
                      <span className="text-xs text-green-600 font-semibold">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="p-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                      title="Add to Wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <BiSolidOffer className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No offers available
            </h3>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
