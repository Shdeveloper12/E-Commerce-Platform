"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OfferProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  isOfferProduct: boolean;
  offerType: string | null;
  offerStartDate: string | null;
  offerEndDate: string | null;
  imageUrl: string;
  slug: string;
}

export default function AdminOffersPage() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkOfferType, setBulkOfferType] = useState("REGULAR_OFFER");
  const [bulkDiscount, setBulkDiscount] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/offers/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleApplyBulkOffer = async () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (!bulkDiscount || parseFloat(bulkDiscount) <= 0) {
      toast.error("Please enter a valid discount percentage");
      return;
    }

    try {
      const response = await fetch("/api/admin/offers/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          offerType: bulkOfferType,
          discountPercentage: parseFloat(bulkDiscount),
          offerStartDate: offerStartDate || null,
          offerEndDate: offerEndDate || null,
        }),
      });

      if (response.ok) {
        toast.success(`Offer applied to ${selectedProducts.size} products`);
        setSelectedProducts(new Set());
        setBulkDiscount("");
        fetchProducts();
      } else {
        toast.error("Failed to apply offer");
      }
    } catch (error) {
      console.error("Error applying bulk offer:", error);
      toast.error("Failed to apply offer");
    }
  };

  const handleRemoveOffer = async (productId: string) => {
    try {
      const response = await fetch("/api/admin/offers/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        toast.success("Offer removed");
        fetchProducts();
      } else {
        toast.error("Failed to remove offer");
      }
    } catch (error) {
      console.error("Error removing offer:", error);
      toast.error("Failed to remove offer");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Offers</h1>
      </div>

      {/* Bulk Actions Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Bulk Offer Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Type
            </label>
            <select
              value={bulkOfferType}
              onChange={(e) => setBulkOfferType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="REGULAR_OFFER">Regular Offer</option>
              <option value="HAPPY_HOUR">Happy Hour</option>
              <option value="FLASH_SALE">Flash Sale</option>
              <option value="SEASONAL_SALE">Seasonal Sale</option>
              <option value="CLEARANCE">Clearance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount %
            </label>
            <input
              type="number"
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              placeholder="20"
              min="1"
              max="99"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={offerStartDate}
              onChange={(e) => setOfferStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={offerEndDate}
              onChange={(e) => setOfferEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyBulkOffer}
              disabled={selectedProducts.size === 0}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              Apply to {selectedProducts.size} Selected
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Select products below and click "Apply" to add them to offers with the specified discount.
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSelectAll}
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {selectedProducts.size === filteredProducts.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleToggleSelect(product.id)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">৳{product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discountPrice ? (
                        <span className="text-orange-600 font-bold">৳{product.discountPrice.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.offerType ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                          {product.offerType.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.isOfferProduct ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.isOfferProduct && (
                        <button
                          onClick={() => handleRemoveOffer(product.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove Offer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
