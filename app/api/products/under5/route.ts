import { NextRequest, NextResponse } from "next/server";
import { fetchUnder5Store } from "@/lib/aliexpress-under5";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url); 
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);

    // FIXED: Structuring parameters matching exactly with the single structural argument signature
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
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to compile under-5 high-volume streaming process pipeline" },
      { status: 500 }
    );
  }
}
