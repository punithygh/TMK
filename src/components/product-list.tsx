import ProductCard from "./product-card";

// 🚨 Updated Interface to match our safe ProductCard
interface Product {
  id: number;
  title: string;
  slug: string;
  category_name?: string;
  image?: string;
  rating?: number;
  address?: string;
}

interface ProductListProps {
  products: Product[];
  isLoading?: boolean; // 🚀 New: Premium Loading State
}

const ProductList = ({ products, isLoading }: ProductListProps) => {
  
  // 1. 🚀 Premium Skeleton Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-[380px] w-full rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse border border-gray-200 dark:border-slate-700">
            <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-t-2xl"></div>
            <div className="p-5 space-y-4">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded-xl mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. 🚨 Strict Empty State Handling
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center glass-panel rounded-3xl border-dashed border-2">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Listings Found</h3>
        <p className="text-slate-500 max-w-xs mx-auto">
          ಕ್ಷಮಿಸಿ, ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 🚀 Premium Responsive Grid with Safe Mapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products?.map((item) => (
          // 🚨 item ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಂಡು ಪಾಸ್ ಮಾಡಲಾಗುತ್ತಿದೆ
          item && <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
