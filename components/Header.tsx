"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect, useRef, useMemo, useCallback } from "react";
import { useShopStore } from "@/store/useShopStore";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Flame,
  Home,
  Grid3X3,
  Compass,
  Zap,
  BookOpen,
  Wrench,
  GitCompare,
  Phone,
  Gem,
  Tv,
  Car,
  Sun,
  Lock,
  TrendingUp,
  Sparkles,
  Package,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const NAV_LINKS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/categories", icon: Grid3X3, label: "All Categories" },
  { href: "/keywords", icon: Zap, label: "Quick Tags" }, // Added to Mobile Drawer Navigation Matrix Loop
  { href: "/browse", icon: Compass, label: "Browse" },
  { href: "/wishlist", icon: Heart, label: "Shopping Boards" },
  { href: "/cart", icon: ShoppingCart, label: "Your Cart" },
  { href: "/deals", icon: Flame, label: "Hot Deals", highlight: true },
  { href: "/trending", icon: TrendingUp, label: "Trending" },
  { href: "/new-arrivals", icon: Sparkles, label: "New Arrivals" },
  { href: "/offers", icon: Package, label: "Offers" },
  { href: "/feed", icon: Zap, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/compare", icon: GitCompare, label: "Compare" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/tools", icon: Wrench, label: "Tools" },
];

const TOP_CATS = [
  { href: "/categories/phones-smartphones", icon: Phone, label: "Phones" },
  { href: "/categories/consumer-electronics", icon: Tv, label: "Electronics" },
  { href: "/categories/jewelry-watches", icon: Gem, label: "Jewelry" },
  { href: "/categories/automotive", icon: Car, label: "Auto" },
  { href: "/categories/solar-energy", icon: Sun, label: "Solar" },
  { href: "/categories/security-systems", icon: Lock, label: "Security" },
];

const SUGGESTIONS = [
  "smartphone 5G",
  "wireless earbuds",
  "smartwatch",
  "gaming laptop",
  "diamond ring",
  "luxury sofa",
  "electric bike",
  "robot vacuum",
  "laser engraver",
  "solar panel",
  "massage chair",
  "drone 4K",
  "wedding dress",
  "coffee machine",
  "CCTV system",
  "3D printer",
];

function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLFormElement>(null);

  const cart = useShopStore((state) => state.cart);
  const wishlistBoards = useShopStore((state) => state.wishlistBoards);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
  const wishlistItemsCount = mounted
    ? wishlistBoards.reduce((acc, board) => acc + board.products.length, 0)
    : 0;

  const filteredSuggestions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return SUGGESTIONS.slice(0, 6);

    const filtered = SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(cleanQuery)
    );

    return (filtered.length ? filtered : SUGGESTIONS).slice(0, 8);
  }, [query]);

  const navigateToBrowse = useCallback(
    (value: string, method: "push" | "replace" = "push") => {
      const cleanValue = value.trim();
      setQuery(cleanValue);
      setShowSugg(false);

      const target = cleanValue ? `/browse?q=${encodeURIComponent(cleanValue)}` : "/browse";
      router[method](target, { scroll: false });
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToBrowse(query, "push");
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    setShowSugg(true);

    const cleanValue = val.trim();
    const target = cleanValue ? `/browse?q=${encodeURIComponent(cleanValue)}` : "/browse";
    router.replace(target, { scroll: false });
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchWrapRef.current && !searchWrapRef.current.contains(target)) {
        setShowSugg(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setShowSugg(false);
  }, [urlQuery]);

  const clearSearch = () => {
    setQuery("");
    setShowSugg(false);
    router.replace("/browse", { scroll: false });
    inputRef.current?.focus();
  };

  return (
    <>
      {showSugg && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-all pointer-events-none" />
      )}

      <div className="bg-orange-700 text-white text-xs py-1.5 px-4 text-center hidden sm:block font-medium tracking-wide relative z-50">
        🔥 Flash Sale: Up to 80% OFF — Free Shipping on orders over $10 &nbsp;|&nbsp; 🌍 Ships Worldwide
      </div>

      <header className="bg-orange-500 shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3.5">

          <div className="grid grid-cols-12 items-center gap-x-3 gap-y-2.5 md:flex md:gap-4">

            <div className="col-span-6 flex items-center gap-2 md:flex-shrink-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-white p-1.5 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>

              <Link href="/" className="flex items-center gap-0.5">
                <span className="text-white font-black text-2xl tracking-tight">Shop</span>
                <span className="bg-white text-orange-500 font-black text-2xl px-2 py-0.5 rounded-xl tracking-tight shadow-sm">
                  Peak
                </span>
              </Link>
            </div>

            <div className="col-span-6 flex items-center justify-end gap-3 text-white md:hidden">
              <Link href="/wishlist" className="relative p-1.5 hover:bg-orange-600 rounded-lg transition-colors">
                <Heart size={22} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-orange-500">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-1.5 hover:bg-orange-600 rounded-lg transition-colors">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-yellow-300 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-orange-500">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            <form ref={searchWrapRef} onSubmit={handleSearch} className="col-span-12 md:flex-1 relative min-w-0 z-50">
              <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-transparent focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-700 transition-all">
                <Search size={18} className="ml-4 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setShowSugg(true)}
                  placeholder="Search products, brands, premium categories..."
                  className="w-full px-3 py-2.5 text-sm sm:text-[15px] outline-none text-gray-800 bg-transparent min-w-0 placeholder-gray-400 font-medium"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 px-3 transition-colors flex-shrink-0"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="bg-orange-700 hover:bg-orange-800 text-white self-stretch px-5 font-bold transition-colors flex-shrink-0 flex items-center justify-center cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>

              {showSugg && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[60] max-h-80 overflow-y-auto animate-fadeIn">
                  <div className="px-4 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    {query.trim() ? "Suggested Keywords" : "Popular Term Suggestions"}
                  </div>
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigateToBrowse(suggestion, "push");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition-all border-b border-gray-50/60 last:border-0 cursor-pointer"
                    >
                      <Search size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate font-medium">{suggestion}</span>
                      <ChevronRight size={12} className="ml-auto text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </form>

            <div className="hidden md:flex items-center gap-4 text-white font-bold text-sm flex-shrink-0">
              <Link
                href="/wishlist"
                className="relative group p-1.5 flex flex-col items-center justify-center hover:text-yellow-100 transition-colors"
              >
                <Heart size={21} className="group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-bold mt-0.5 hidden lg:block">Wishlist</span>
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-orange-500 shadow shadow-sm">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative group p-1.5 flex flex-col items-center justify-center bg-orange-600/50 hover:bg-orange-700 border border-orange-400/20 px-3 py-1.5 rounded-xl transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShoppingCart size={20} className="group-hover:scale-105 transition-transform" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-yellow-300 text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-orange-500">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black hidden lg:block uppercase tracking-wider">Cart</span>
                </div>
              </Link>
            </div>
          </div>

          <nav className="flex items-center gap-1 mt-3 overflow-x-auto select-none scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            <style jsx global>{`
              nav::-webkit-scrollbar { display: none; }
            `}</style>
            <Link
              href="/categories"
              className="text-white text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors font-bold flex-shrink-0 shadow-sm"
            >
              ☰ All
            </Link>
            
            {/* INJECTED HIGHLIGHT: Quick Tags system shortcut applied onto the static bar navigation */}
            <Link
              href="/keywords"
              className="text-white text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-orange-700 border border-orange-400/20 hover:bg-orange-800 transition-colors font-black flex-shrink-0 animate-pulse flex items-center gap-1"
            >
              ⚡ Quick Tags
            </Link>

            {CATEGORIES.slice(0, 10).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-white/90 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 hover:text-white transition-colors flex-shrink-0 font-medium"
              >
                {cat.icon} <span className="ml-0.5">{cat.name}</span>
              </Link>
            ))}
            <Link
              href="/trending"
              className="text-yellow-200 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-1"
            >
              📈 Trending
            </Link>
            <Link
              href="/deals"
              className="text-yellow-200 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-auto"
            >
              🔥 Flash Sale
            </Link>
          </nav>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-76 max-w-[85vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col transition-transform duration-200">
            <div className="bg-orange-500 px-4 py-4 flex items-center justify-between flex-shrink-0 shadow-md">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-0.5">
                <span className="text-white font-black text-xl">Shop</span>
                <span className="bg-white text-orange-500 font-black text-xl px-1.5 py-0.5 rounded-lg shadow-sm">Peak</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white hover:bg-orange-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-b border-gray-100">
              <Link
                href="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
              >
                <Heart size={15} className="text-red-500 fill-red-500" />
                Boards ({wishlistItemsCount})
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-600 shadow-sm"
              >
                <ShoppingCart size={15} className="text-orange-500" />
                Cart ({cartItemsCount})
              </Link>
            </div>

            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Navigation
              </p>
              {NAV_LINKS.map(({ href, icon: Icon, label, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-colors ${
                    highlight
                      ? "bg-red-50 text-red-600 hover:bg-red-100 font-bold"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon size={17} className={highlight ? "text-red-500" : "text-orange-400"} />
                  <span className="text-sm font-semibold">{label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            <div className="px-3 py-3 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Top Categories
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TOP_CATS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex flex-col items-center gap-1.5 p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors text-center"
                  >
                    <Icon size={20} className="text-orange-500" />
                    <span className="text-[11px] font-semibold text-gray-700 truncate w-full px-0.5">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-3 py-3 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                All Categories
              </p>
              {CATEGORIES.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <span className="text-lg w-6 text-center">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                  <ChevronRight size={13} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-500 font-medium justify-center">
                <Link href="/about" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">About</Link>
                <span>·</span>
                <Link href="/contact-us" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Contact</Link>
                <span>·</span>
                <Link href="/support" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Support</Link>
                <span>·</span>
                <Link href="/privacy" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Privacy</Link>
                <span>·</span>
                <Link href="/terms" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <div className="bg-orange-500 h-14 sticky top-0 z-50 flex items-center px-4 shadow-md justify-between">
          <div className="flex items-center gap-0.5">
            <span className="text-white font-black text-xl">Shop</span>
            <span className="bg-white text-orange-500 font-black text-xl px-1.5 py-0.5 rounded-lg ml-0.5">Peak</span>
          </div>
        </div>
      }
    >
      <HeaderSearch />
    </Suspense>
  );
}
