"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { Sparkles, Clock, RefreshCw } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCat, setSelectedCat] = useState("");
  const seedRef = useRef(0);

  // Unique session seed initialization for controlling random distributions
  useEffect(() => {
    const key = "sp_new_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0");
    if (!s) { 
      s = Math.floor(Math.random() * 9999) + 1; 
      sessionStorage.setItem(key, String(s)); 
    }
    seedRef.current = s;
  }, []);

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: String(p), 
        pageSize: "50", 
        seed: String(seedRef.current),
        // CRITICAL FIX: Tells the backend engine to diversify results instead of a sequential block dump
        mode: "diversified",
        sort: "mixed"
      });
      
      if (selectedCat) {
        params.set("cat", selectedCat);
      } else {
        // If "All" is active, send primary category IDs to force cross-niche array mixing in the DB query
        const sampleCats = CATEGORIES.slice(0, 8).map(c => c.id).join(",");
        params.set("mix_cats", sampleCats);
      }

      const res = await fetch(`/api/products/new-arrivals?${params}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      setTotalPages(Math.min(data.totalPage || 100, 200));
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("Failed loading products loop:", error);
    } finally { 
      setLoading(false); 
    }
  }, [selectedCat]);

  useEffect(() => { 
    setPage(1); 
  }, [selectedCat]);

  useEffect(() => { 
    fetchProducts(page); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [page, fetchProducts]);

  // Premium feature to manually break sticky loops and re-shuffle the feed immediately
  const handleRefreshMix = () => {
    const newSeed = Math.floor(Math.random() * 9999) + 1;
    sessionStorage.setItem("sp_new_seed", String(newSeed));
    seedRef.current = newSeed;
    if (page === 1) {
      fetchProducts(1);
    } else {
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Header Block */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={28} className="text-yellow-300" />
                <h1 className="text-3xl font-black">New Arrivals</h1>
              </div>
              <p className="text-purple-100">The freshest products just landed — discover what&apos;s new</p>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full whitespace-nowrap">
                <Clock size={14} className="text-yellow-300" /> Updated daily
              </span>
              <button 
                onClick={handleRefreshMix}
                disabled={loading}
                className="flex items-center gap-1.5 bg-purple-700/50 hover:bg-purple-700 border border-purple-400/30 px-3 py-1.5 rounded-full transition-all cursor-pointer text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Shuffle Mix
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation Slider */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button 
            onClick={() => setSelectedCat("")} 
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${!selectedCat ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}
          >
            All Feed
          </button>
          {CATEGORIES.slice(0, 12).map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCat(selectedCat === cat.id ? "" : cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${selectedCat === cat.id ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Stream */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-500">{totalCount.toLocaleString()} products available</p>
        </div>

        <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />

        {!loading && products.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={p => setPage(p)} 
            showTotal={totalCount} 
            perPage={50} 
          />
        )}
      </div>
    </div>
  );
}
