"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { AliProduct } from "@/lib/aliexpress";
import { Loader2, RefreshCw } from "lucide-react";

// CATEGORY ROTATOR: Broad niches for continuous variation
const ROTATION_CATEGORIES = [
  "electronics", "home_decor", "fashion", "tech_gadgets", 
  "smart_appliances", "jewelry", "outdoor_gear", "gaming"
];

const SORT_OPTIONS = ["VOLUME_DESC", "NEWEST", "PRICE_ASC"];

export default function FeedPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Rotation States
  const [catIdx, setCatIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const category = ROTATION_CATEGORIES[catIdx % ROTATION_CATEGORIES.length];
      const sort = SORT_OPTIONS[sortIdx % SORT_OPTIONS.length];
      const seed = Math.floor(Math.random() * 99999);

      const params = new URLSearchParams({
        cat: category,
        sort: sort,
        page: String(page),
        pageSize: "50",
        seed: String(seed)
      });

      const res = await fetch(`/api/products/featured?${params.toString()}`);
      const data = await res.json();
      const newProducts: AliProduct[] = data.products || [];

      if (newProducts.length === 0) {
        setCatIdx(i => i + 1);
        setPage(1); 
      } else {
        setProducts(prev => {
          const unique = newProducts.filter(p => !prev.find(x => x.product_id === p.product_id));
          return [...prev, ...unique];
        });
        setPage(p => p + 1);
        if (page % 3 === 0) setSortIdx(i => i + 1);
      }
    } catch (err) {
      console.error("Failed to fetch next rotation frame:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, catIdx, sortIdx]);

  useEffect(() => { 
    loadMore(); 
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Live Discovery Feed</h1>
          <p className="text-sm text-gray-500">Auto-refreshing trending global inventory</p>
        </div>
        <button 
          onClick={() => { setProducts([]); setPage(1); loadMore(); }} 
          className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors cursor-pointer"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* FIXED STRUCTURE: Added proper explicit mapping to resolve strict TypeScript parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard 
            key={p.product_id} 
            id={p.product_id}
            title={p.product_title}
            image={p.product_main_image_url}
            salePrice={p.app_sale_price || p.sale_price}
            originalPrice={p.original_price}
            discount={p.discount}
            rating={p.evaluate_rate}
            soldCount={p.lastest_volume}
            source="feed"
          />
        ))}
      </div>

      <div ref={loaderRef} className="py-10 text-center">
        {loading && <Loader2 className="animate-spin mx-auto text-orange-500" size={32} />}
      </div>
    </div>
  );
}
