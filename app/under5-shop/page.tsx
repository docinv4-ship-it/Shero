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
        
        // FIXED: Removed the incorrect "/app" prefix to perfectly call the core handler route
        const res = await fetch(`/api/products/under5?${urlParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Client side retrieval block error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEngineData();
  }, [activeCategory, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-[#fafafa]">
      
      {/* Structural Node Selector (Category Navigation Grid) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none mt-2">
        <button
          onClick={() => { setActiveCategory(""); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            activeCategory === ""
              ? "bg-gray-900 text-white border-gray-900 shadow-xs"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          <Flame size={13} /> Trending Drops
        </button>
        {PREMIUM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.id
                ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Execution Stream */}
      {products.length === 0 && !loading ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto">
          <p className="text-sm font-bold text-gray-800">Recalibrating Stream Layers</p>
          <p className="text-xs text-gray-400 mt-1">The recommendation cluster is processing next-level node maps. Try refreshing.</p>
        </div>
      ) : (
        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={20} />
      )}

      {/* Clean Control Level Pagination */}
      {!loading && products.length > 0 && (
        <div className="mt-10">
          <Pagination 
            currentPage={page} 
            totalPages={10} 
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
            perPage={50} 
          />
        </div>
      )}
    </div>
  );
}
