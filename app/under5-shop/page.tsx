"use client";
import { useState, useEffect } from "react";
import { PREMIUM_CATEGORIES } from "@/lib/aliexpress-under5";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { Sparkles, Terminal, Flame, Layers } from "lucide-react";

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
        
        const res = await fetch(`/app/api/products/under5?${urlParams.toString()}`);
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
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-[#fafafa]">
      
      {/* Premium Minimalist Header Block */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Dynamic Value Curation
            </span>
            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md text-[10px] font-mono">
              Pure-Node-Sync
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">The Edge Shop</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-lg">
            High-perceived value tech gear, EDC tools, and premium hardware. Hardcoded and locked under $4.99 using algorithmic sorting pipelines.
          </p>
        </div>

        {/* Live Performance Micro Ticker */}
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl font-mono text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-blue-500" />
            <span>Feeds: <strong className="text-gray-900">Active</strong></span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Terminal size={13} className="text-emerald-500" />
            <span>Keyword Overrides: <strong className="text-gray-900">Bypassed</strong></span>
          </div>
        </div>
      </div>

      {/* Structural Node Selector (Category Navigation Grid) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
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
