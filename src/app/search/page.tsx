"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Product from "@/components/ui/product";
import { BsSearch } from "react-icons/bs";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  brand: string;
  imageUrl: string;
  category: string;
  stockQuantity: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formattedProducts = results.map((product) => ({
    ...product,
    rating: 0,
    reviews: 0,
    isFeatured: false,
    isInStock: product.stockQuantity > 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Search Results</li>
          </ol>
        </nav>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <BsSearch className="text-orange-600" />
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600 text-lg">
              Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            {loading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {results.length} {results.length === 1 ? "Product" : "Products"} Found
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : !query ? (
          <div className="text-center py-16">
            <BsSearch className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter a search term</h3>
            <p className="text-gray-600 mb-6">
              Use the search box above to find products
            </p>
          </div>
        ) : results.length > 0 ? (
          <Product products={formattedProducts} />
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <BsSearch className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}". Try different keywords or browse our categories.
            </p>
            <Link href="/">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
                Browse Categories
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
