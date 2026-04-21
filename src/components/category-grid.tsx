import Link from "next/link";
import { 
  Hotel, 
  Hospital, 
  Bed, 
  Utensils, 
  ShoppingBag, 
  Home, 
  Briefcase, 
  GraduationCap,
  Layers
} from "lucide-react";

// 🚨 Category Data Structure (Mapped from Django Models)
const categories = [
  { id: 1, name: "Hotels", name_kn: "ಹೋಟೆಲ್", slug: "hotels", icon: Hotel, color: "text-orange-500" },
  { id: 2, name: "Hospitals", name_kn: "ಆಸ್ಪತ್ರೆ", slug: "hospitals", icon: Hospital, color: "text-red-500" },
  { id: 3, name: "PGs", name_kn: "ಪಿಜಿ", slug: "pgs", icon: Bed, color: "text-blue-500" },
  { id: 4, name: "Food", name_kn: "ಊಟ", slug: "restaurants", icon: Utensils, color: "text-green-500" },
  { id: 5, name: "Shops", name_kn: "ಅಂಗಡಿ", slug: "shops", icon: ShoppingBag, color: "text-pink-500" },
  { id: 6, name: "Real Estate", name_kn: "ನಿವೇಶನ", slug: "real-estate", icon: Home, color: "text-purple-500" },
  { id: 7, name: "Jobs", name_kn: "ಕೆಲಸ", slug: "jobs", icon: Briefcase, color: "text-amber-600" },
  { id: 8, name: "Education", name_kn: "ಶಿಕ್ಷಣ", slug: "education", icon: GraduationCap, color: "text-indigo-500" },
];

const CategoryGrid = () => {
  return (
    <section className="mobile-container py-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <Layers className="text-blue-600" size={24} />
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          ಸೇವೆಗಳಿಗಾಗಿ ಹುಡುಕಿ <span className="text-slate-400 font-medium ml-2">/ Explore Services</span>
        </h2>
      </div>

      {/* 🚀 Premium Grid System (4 columns on mobile, 8 on desktop) */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors mb-3`}>
              <cat.icon className={`${cat.color} group-hover:scale-110 transition-transform duration-300`} size={24} />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 text-center line-clamp-1">
              {cat.name_kn}
            </span>
            <span className="hidden md:block text-[9px] text-slate-400 font-medium">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;