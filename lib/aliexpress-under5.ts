import { AliProduct } from "./aliexpress"; // Importing existing types safely

// Curated Category Nodes with High Perceived Value (No cheap junk)
export const PREMIUM_CATEGORIES = [
  { id: "509", name: "Tech Gadgets" },         // Phones & Accessories (Power banks, chargers, controllers)
  { id: "1501", name: "Computer & Office" },   // Mechanical keys, hubs, ambient RGB strips
  { id: "39", name: "Tools & Hardware" },      // Multi-tools, EDC gear, tech repair kits
  { id: "1524", name: "Modern Timepieces" },   // Minimalist watches, metal straps
  { id: "1503", name: "Automotive Tech" },     // Car wireless modules, sleek organizers
];

// Seed Product IDs for the Amazon-Style Recommendation Loop
const HIGH_VALUE_SEEDS = [
  "1005006123456789", // Minimalist Carbon Fiber Wallet
  "1005006987654321", // 100W Braided Smart Cable
  "1005007112233445", // COB Rechargeable Pocket Light
  "1005007556677889", // Matte Black Coffee Frother
];

// Strict Trash Culling Configuration
const TRASH_BLACKLIST = [
  "case only", "screen protector", "glass film", "sticker", "decal", 
  "replacement part", "screws", "silicone sleeve", "dust plug", "box only", 
  "disposable", "repair glue", "patch", "lanyard", "pouch"
];

export interface Under5Filters {
  categoryId?: string;
  page: number;
}

export async function fetchUnder5Store({ categoryId, page }: Under5Filters) {
  try {
    const seed = Math.floor(Math.random() * 9999) + 1;
    let rawProducts: any[] = [];

    // SYSTEM 1 & 3: Mix Choice/Hot Feeds and Category Sweeps dynamically
    const queryParams = new URLSearchParams({
      page: String(page),
      pageSize: "60", 
      minPrice: "1.20", // Block 10-cent items like stickers
      maxPrice: "4.99", // Strict upper threshold limit
      sort: "VOLUME_DESC", // Highest conversion volume products first
      seed: String(seed),
      highQuality: "true"
    });

    if (categoryId) {
      queryParams.append("categoryId", categoryId);
    } else {
      // SYSTEM 3: If no category is selected, rotate target categories to keep feed endlessly fresh
      const randomCategory = PREMIUM_CATEGORIES[Math.floor(Math.random() * PREMIUM_CATEGORIES.length)].id;
      queryParams.append("categoryId", randomCategory);
    }

    // Hit the main data stream endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/products/search?${queryParams.toString()}`, {
      cache: "no-store"
    });
    
    if (response.ok) {
      const data = await response.json();
      rawProducts = data.products || [];
    }

    // SYSTEM 2: Recommendation Loop Fallback Engine
    // If the category returns insufficient results, fetch contextually related products based on our premium seeds
    if (rawProducts.length < 15) {
      const randomSeed = HIGH_VALUE_SEEDS[Math.floor(Math.random() * HIGH_VALUE_SEEDS.length)];
      const recommendationParams = new URLSearchParams({ productId: randomSeed, count: "40" });
      const recResponse = await fetch(`/api/products/recommendations?${recommendationParams.toString()}`);
      if (recResponse.ok) {
        const recData = await recResponse.json();
        rawProducts = [...rawProducts, ...(recData.products || [])];
      }
    }

    // SERVER-SIDE GATEKEEPER PIPELINE
    const sanitizedProducts = rawProducts.filter((product) => {
      const title = (product.title || product.subject || "").toLowerCase();
      const price = parseFloat(product.target_sale_price || product.price || "0");
      const rating = parseFloat(product.evaluate_rate || "5.0");
      const sales = parseInt(product.volume || "0");

      // Rule A: Hardcoded price cap block
      if (price > 4.99 || price < 1.00) return false;

      // Rule B: High rating requirement for social proof
      if (rating < 4.4 && sales > 50) return false;

      // Rule C: String matching blacklist execution (Removes cases, films, stickers)
      const matchesBlacklist = TRASH_BLACKLIST.some(trashWord => title.includes(trashWord));
      if (matchesBlacklist) return false;

      return true;
    });

    // SYSTEM 3 Logic: Incase server-side filtering cuts out too much data, map backup fields smoothly
    return sanitizedProducts.map(p => ({
      ...p,
      // Anchor Pricing Simulation Mechanism (Ensures Amazon level structural discount visibility)
      simulated_original_price: p.original_price || (parseFloat(p.target_sale_price || p.price) * (Math.random() * (4 - 2) + 2)).toFixed(2)
    }));

  } catch (error) {
    console.error("Critical error inside Under5 isolated data layer:", error);
    return [];
  }
}
