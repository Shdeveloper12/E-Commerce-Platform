"use client";

import { useEffect, useState } from 'react';

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        console.log('API Response:', data);
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="p-8">Loading categories...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Categories Test Page</h1>
      <p className="mb-4">Total categories: {categories.length}</p>
      
      <div className="space-y-6">
        {categories.map((cat, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
            <p className="text-sm text-gray-600 mb-2">Slug: {cat.slug}</p>
            <p className="text-sm text-gray-600 mb-2">Href: {cat.href}</p>
            <p className="text-sm font-medium mb-2">
              Subcategories: {cat.subcategories?.length || 0}
            </p>
            
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="ml-4 mt-2">
                <ul className="list-disc list-inside space-y-1">
                  {cat.subcategories.map((sub: any, subIndex: number) => (
                    <li key={subIndex} className="text-sm">
                      {sub.name} ({sub.slug})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
