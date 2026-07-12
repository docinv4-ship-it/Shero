export const PREMIUM_CATEGORIES = [
  { id: "509", name: "Tech Gadgets", baseQueries: ["usb gadget", "mini charger", "led light type c"] },         
  { id: "1501", name: "Computer & Office", baseQueries: ["rgb led mousepad", "keycap artisan", "usb hub splitter"] },   
  { id: "39", name: "Tools & Hardware", baseQueries: ["edc pocket tool", "multi screwdriver"] },      
  { id: "1524", name: "Modern Timepieces", baseQueries: ["minimalist watch", "nylon strap quartz"] },   
  { id: "1503", name: "Automotive Tech", baseQueries: ["car organizer pouch", "air vent mount"] },     
];

export interface Under5Filters {
  categoryId?: string;
  page: number;
  origin: string; 
}

export async function fetchUnder5Store({ categoryId, page, origin }: Under5Filters) {
  try {
    const currentCat = PREMIUM_CATEGORIES.find(c => c.id === categoryId) || PREMIUM_CATEGORIES[0];
    const queryIndex = (page - 1) % currentCat.baseQueries.length;
    const targetQuery = currentCat.baseQueries[queryIndex];

    const queryParams = new URLSearchParams({
      page: String(page),
      pageSize: "60",
      sort: "VOLUME_DESC", // Grok recommended: Low price scaling or high volume focus
      q: targetQuery,
      minPrice: "0.50",
      maxPrice: "4.99" // API request filters
    });

    if (categoryId) {
      queryParams.append("categoryId", categoryId);
    }

    const response = await fetch(`${origin}/api/products/search?${queryParams.toString()}`, {
      cache: "no-store"
    });

    if (!response.ok) return [];
    const data = await response.json();
    const rawProducts = data.products || [];

    // GROK ARCHITECTURE: Filter strictly on the server-side, do NOT manipulate prices.
    // If an item exceeds $4.99, it is dropped completely from the stream.
    return rawProducts.filter((p: any) => {
      const actualPrice = parseFloat(p.target_sale_price || p.price || p.sale_price || "0");
      return actualPrice > 0 && actualPrice <= 4.99;
    });

  } catch (error) {
    console.error("Server-side architecture block failure:", error);
    return [];
  }
}
