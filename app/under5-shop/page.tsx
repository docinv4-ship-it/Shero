"use client";
import { useState, useEffect } from "react";
import { PREMIUM_CATEGORIES } from "@/lib/aliexpress-under5";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { Flame } from "lucide-react";

export default function Under5MegaShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function loadEngineData() {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams({
          page: String(page),
          ...(activeCategory && { categoryId: activeCategory })
        });

        // Appended custom timestamp context injection mechanism to burst network distribution caches
        const res = await fetch(`/api/products/under5?${urlParams.toString()}&_t=${Date.now()}`, { 
          cache: "no-store" 
        });
        
        if (res.ok) {
          const data = await res.json();
          
          // Strict real-time safety fallback gatekeeper checking 
          const cleanStreamData = (data.products || []).filter((p: any) => {
            const parsedPrice = parseFloat(p.target_sale_price || p.price || "0");
            return parsedPrice > 0 && parsedPrice <= 4.99;
          });
          
          setProducts(cleanStreamData);
        }
      } catch (err) {
        console.error("Component data processing block failure notice:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEngineData();
  }, [activeCategory, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-[#fafafa]">
      
      {/* Dynamic Smooth Layout Segmented Controller Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none mt-2">
        <button
          onClick={() => { setActiveCategory(""); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            activeCategory === "" ? "bg-gray-900 text-white border-gray-900 shadow-xs" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          <Flame size={13} /> Trending Drops
        </button>
        {PREMIUM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.id ? "bg-gray-900 text-white border-gray-900 shadow-xs" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Render Node Pipeline Control */}
      {products.length === 0 && !loading ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto shadow-xs">
          <p className="text-sm font-bold text-gray-800">Recalibrating Under $5 Feed</p>
          <p className="text-xs text-gray-400 mt-1">Sourcing fresh micro-budget inventories. Switch tabs or reset filters.</p>
        </div>
      ) : (
        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={25} />
      )}

      {/* Massive Pagination System (Simulates boundless entries seamlessly) */}
      {!loading && products.length > 0 && (
        <div className="mt-12">
          <Pagination 
            currentPage={page} 
            totalPages={150} 
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
            perPage={40} 
          />
        </div>
      )}
    </div>
  );
}
