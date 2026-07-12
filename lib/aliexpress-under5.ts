import { AliProduct } from "./aliexpress"; 

export const PREMIUM_CATEGORIES = [
  { id: "509", name: "Tech Gadgets", query: "usb gadget" },         
  { id: "1501", name: "Computer & Office", query: "rgb led mini" },   
  { id: "39", name: "Tools & Hardware", query: "edc multi tool" },      
  { id: "1524", name: "Modern Timepieces", query: "minimalist watch" },   
  { id: "1503", name: "Automotive Tech", query: "car organizer" },     
];

const TRASH_BLACKLIST = [
  "case only", "screen protector", "glass film", "sticker", "decal", 
  "replacement part", "screws", "silicone sleeve", "dust plug", "box only", 
  "disposable", "repair glue", "patch", "lanyard", "pouch"
];

export interface Under5Filters {
  categoryId?: string;
  page: number;
}

export async function fetchUnder5Store({ categoryId, page }: Under5Filters, origin: string) {
  try {
    const seed = Math.floor(Math.random() * 9999) + 1;
    let rawProducts: any[] = [];

    // Find selected category configuration for query fallback
    const currentCat = PREMIUM_CATEGORIES.find(c => c.id === categoryId) || 
                       PREMIUM_CATEGORIES[Math.floor(Math.random() * PREMIUM_CATEGORIES.length)];

    const queryParams = new URLSearchParams({
      page: String(page),
      pageSize: "40", 
      minPrice: "1.00", 
      maxPrice: "4.99", 
      sort: "VOLUME_DESC", 
      seed: String(seed),
      highQuality: "true",
      q: currentCat.query // Added fallback query text to force existing search endpoints to populate items
    });

    if (categoryId) {
      queryParams.append("categoryId", categoryId);
    }

    // FIXED: Using dynamic absolute origin to completely bypass serverless execution breaks
    const response = await fetch(`${origin}/api/products/search?${queryParams.toString()}`, {
      cache: "no-store"
    });
    
    if (response.ok) {
      const data = await response.json();
      rawProducts = data.products || [];
    }

    // SERVER-SIDE GATEKEEPER PIPELINE
    const sanitizedProducts = rawProducts.filter((product) => {
      const title = (product.title || product.subject || "").toLowerCase();
      const price = parseFloat(product.target_sale_price || product.price || "0");
      const rating = parseFloat(product.evaluate_rate || "5.0");
      const sales = parseInt(product.volume || "0");

      if (price > 4.99 || price < 0.80) return false;
      if (rating < 4.2 && sales > 30) return false;

      const matchesBlacklist = TRASH_BLACKLIST.some(trashWord => title.includes(trashWord));
      if (matchesBlacklist) return false;

      return true;
    });

    return sanitizedProducts.map(p => ({
      ...p,
      simulated_original_price: p.original_price || (parseFloat(p.target_sale_price || p.price) * 2.5).toFixed(2)
    }));

  } catch (error) {
    console.error("Critical error inside Under5 isolated data layer:", error);
    return [];
  }
}
