'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

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

        const response = await api.get<{ results: Business[] }>(endpoint);
        const data = response.data;
        
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
      <div className="flex overflow-x-auto scrollbar-hide gap-3 mb-8 pb-3 relative z-10 snap-x">
        <button 
          onClick={() => setActiveCategory('')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all shadow-sm snap-start shrink-0 flex items-center gap-2 ${activeCategory === '' ? 'bg-red-50 dark:bg-sky-500/10 border-red-200 dark:border-sky-500/50 text-red-600 dark:text-sky-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
        >
          All
        </button>
        {initialCategories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all shadow-sm snap-start shrink-0 flex items-center gap-2 ${activeCategory === cat.slug ? 'bg-red-50 dark:bg-sky-500/10 border-red-200 dark:border-sky-500/50 text-red-600 dark:text-sky-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
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
