import { NextRequest, NextResponse } from "next/server";
import { fetchUnder5Store } from "@/lib/aliexpress-under5";

// STOPS VERCEL FROM CACHING OLD EXPENSIVE PRODUCTS
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url); 
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);

    const filteredProducts = await fetchUnder5Store({ 
      categoryId, 
      page, 
      origin: origin || "https://shopee-mu.vercel.app"
    });

    return NextResponse.json({
      success: true,
      page,
      count: filteredProducts.length,
      products: filteredProducts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to compile stream" },
      { status: 500 }
    );
  }
}
