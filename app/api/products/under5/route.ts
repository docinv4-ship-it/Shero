import { NextRequest, NextResponse } from "next/server";
import { fetchUnder5Store } from "@/lib/aliexpress-under5";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);

    // Call the isolated layer engine
    const filteredProducts = await fetchUnder5Store({ categoryId, page });

    return NextResponse.json({
      success: true,
      page,
      count: filteredProducts.length,
      products: filteredProducts
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to load isolated under-5 store feed pipeline" },
      { status: 500 }
    );
  }
}
