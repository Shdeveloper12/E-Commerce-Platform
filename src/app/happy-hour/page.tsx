"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsLightningCharge, BsClock } from "react-icons/bs";
import { motion } from "motion/react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface HappyHourProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  brand: string;
  imageUrl: string;
  category: string;
  stockQuantity: number;
  discountPercentage?: number;
  offerEndDate?: string;
}

export default function HappyHourPage() {
  const [products, setProducts] = useState<HappyHourProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchHappyHourProducts() {
      try {
        const response = await fetch("/api/happy-hour");
        const data = await response.json();
        setProducts(data.products || []);
        
        // Set countdown timer
        if (data.endTime) {
          updateCountdown(data.endTime);
        }
      } catch (error) {
        console.error("Error fetching happy hour products:", error);
        toast.error("Failed to load happy hour deals");
      } finally {
        setLoading(false);
      }
    }

    fetchHappyHourProducts();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const endTime = new Date();
      endTime.setHours(23, 59, 59, 999); // End of day
      updateCountdown(endTime.toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateCountdown = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const distance = end - now;

    if (distance > 0) {
      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    } else {
      setTimeLeft(null);
    }
  };

  const handleAddToCart = (product: HappyHourProduct) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-white">
      {/* Animated Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-12 px-4 relative overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <BsLightningCharge className="text-7xl" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Happy Hour Flash Deals!
            </h1>
            <p className="text-lg md:text-xl text-yellow-100 mb-6">
              Lightning-fast deals that won't last long!
            </p>

            {/* Countdown Timer */}
            {timeLeft && (
              <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4">
                <BsClock className="text-3xl" />
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs">Hours</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs">Minutes</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs">Seconds</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <BsLightningCharge className="text-6xl text-yellow-500" />
            </motion.div>
            <p className="mt-4 text-gray-600">Loading flash deals...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
              >
                {/* Lightning Badge */}
                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
                  <BsLightningCharge /> FLASH
                </div>

                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    {product.discountPercentage}% OFF
                  </div>
                )}

                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-56 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
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

                  {/* Stock & Action */}
                  <div className="flex items-center justify-between mb-3">
                    {product.stockQuantity > 0 ? (
                      <span className="text-xs text-green-600 font-semibold">
                        {product.stockQuantity} left
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">Sold Out</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
                  >
                    <BsLightningCharge />
                    Grab Now!
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <BsLightningCharge className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No flash deals at the moment
            </h3>
            <p className="text-gray-500">Check back during happy hour for amazing deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
