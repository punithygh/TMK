'use client';

import { useState, useEffect } from 'react';
import { fetchFromDjango } from '@/services/api';

// Adjust interfaces based on your Django Serializers
interface Category { id: number; name: string; slug: string; }
interface Business { id: number; name: string; area: string; slug: string; category_name: string; }

export default function CategoryFilter({ initialCategories }: { initialCategories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      try {
        // Build the correct Django DRF Filter Query String
        // MUST use category__slug, not category.
        const endpoint = activeCategory 
          ? `businesses/?category__slug=${activeCategory}` 
          : 'businesses/';

        // fetchFromDjango handles the absolute URL and trailing slashes.
        // cache: 'no-store' forces Next.js 15 to bypass caching so clicking tabs always gets fresh data.
        const data = await fetchFromDjango<{ results: Business[] }>(endpoint, {
          cache: 'no-store'
        });
        
        setBusinesses(data.results);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    // React automatically runs this fetch whenever activeCategory changes.
    loadBusinesses();
  }, [activeCategory]);

  return (
    <div className="w-full my-8">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-4 mb-6 pb-2">
        <button 
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap border ${activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          All
        </button>
        {initialCategories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-full whitespace-nowrap border ${activeCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Business Grid */}
      {loading ? (
        <div className="text-center py-10">Loading businesses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.map(b => (
            <div key={b.id} className="p-5 border rounded-lg shadow-sm hover:shadow-md bg-white">
              <h3 className="font-bold text-lg">{b.name}</h3>
              <p className="text-gray-500 text-sm">{b.category_name} • {b.area}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
