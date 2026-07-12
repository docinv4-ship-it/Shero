import { NextRequest, NextResponse } from "next/server";
import { fetchUnder5Store } from "@/lib/aliexpress-under5";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url); // FIXED: Extracting deployment origin dynamically
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);

    // Pass runtime host origin down to isolated fetch layer
    const filteredProducts = await fetchUnder5Store({ categoryId, page }, origin);

    return NextResponse.json({
      success: true,
      page,
      count: filteredProducts.length,
      products: filteredProducts
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to load isolated under-5 store feed pipeline" },
      { status: 500 }
    );
  }
}
