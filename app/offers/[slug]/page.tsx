"use client";
import { useState, useEffect, use } from "react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import Link from "next/link";
import { Package, Tag, ChevronLeft } from "lucide-react";

// SHORT COMPACT KEYWORDS: Avoids 0-result fallback bugs in AliExpress API
const OFFER_MAP: Record<string, { title: string; desc: string; keyword: string; emoji: string }> = {
  "tech-bundle": { title: "Tech Starter Bundle", desc: "Premium gadgets and desktop tech gear", keyword: "mechanical keyboard", emoji: "💻" },
  "home-essentials": { title: "Home Essentials Pack", desc: "Must-have items for every modern room", keyword: "room humidifier", emoji: "🏠" },
  "beauty-kit": { title: "Beauty & Skincare Kit", desc: "Top-rated cosmetic setups and premium makeup", keyword: "skincare set", emoji: "✨" },
  "fitness-set": { title: "Fitness Starter Set", desc: "Everything to get fit with home gym accessories", keyword: "dumbbells", emoji: "💪" },
  "office-kit": { title: "Work From Home Kit", desc: "Productivity, desk organizers and setup frames", keyword: "desk pad", emoji: "🖥️" },
  "travel-gear": { title: "Travel Essentials", desc: "Everything you need for premium seamless trips", keyword: "packing cubes", emoji: "✈️" },
  "tech-starter-box": { title: "Tech Starter Box", desc: "Curated modern tech gadgets and gears", keyword: "bluetooth earbuds", emoji: "💻" },
  "beauty-box": { title: "Beauty Glow Box", desc: "Premium skin therapies and beauty items", keyword: "makeup kit", emoji: "💄" },
  "home-box": { title: "Smart Home Box", desc: "Smart automation appliances and sensory lights", keyword: "smart led bulb", emoji: "🏠" },
  "fitness-box": { title: "Fitness Pro Box", desc: "Professional grade workout utilities", keyword: "fitness tracker", emoji: "🏋️" },
  "kitchen-box": { title: "Kitchen Essential Box", desc: "Smart automated culinary kitchen accessories", keyword: "coffee frother", emoji: "🍳" },
  "outdoor-box": { title: "Outdoor Adventure Box", desc: "Heavy tactical exploration gear", keyword: "camping lantern", emoji: "🏕️" },
};

export default function OfferSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const offer = OFFER_MAP[slug] || { title: "Special Offer", desc: "Curated products", keyword: "gadget", emoji: "🎁" };

  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(50);

  useEffect(() => {
    setLoading(true);
    
    const seed = parseInt(sessionStorage?.getItem?.("sp_offer_seed") || "0") || Math.floor(Math.random() * 9999) + 1;
    sessionStorage?.setItem?.("sp_offer_seed", String(seed));
    
    const searchParams = new URLSearchParams({ 
      q: offer.keyword, 
      page: String(page), 
      pageSize: "50", 
      seed: String(seed),
      minPrice: "10",            
      sort: "VOLUME_DESC",       
      highQuality: "true"
    });

    fetch(`/api/products/search?${searchParams.toString()}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Math.min(data.totalPage || 50, 100));
      })
      .catch(err => console.error("Search API Error:", err))
      .finally(() => setLoading(false));
  }, [page, offer.keyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/offers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors">
        <ChevronLeft size={15} /> Back to Offers
      </Link>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{offer.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <Package size={18} className="text-yellow-300" />
              <span className="text-xs text-orange-200 font-medium uppercase tracking-wide">Curated Collection</span>
            </div>
            <h1 className="text-2xl font-black">{offer.title}</h1>
          </div>
        </div>
        <p className="text-orange-100">{offer.desc}</p>
        <div className="flex items-center gap-2 mt-3">
          <Tag size={14} className="text-yellow-300" />
          <span className="text-sm text-yellow-200">Affiliate links — ShopPeak earns a small commission</span>
        </div>
      </div>

      <ProductGrid products={products} cols={5} loading={loading} skeletonCount={50} />
      {!loading && products.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} perPage={50} />
      )}
    </div>
  );
}
