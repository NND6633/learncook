// app/api/recipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { removeVietnamese } from "@/lib/removeVietnamese";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = (searchParams.get("search") || "").trim();
  const tag = searchParams.get("tag") || "";
  const sort = searchParams.get("sort") || "asc";

  const skip = (page - 1) * limit;

  // Filter TAG
  const where: any = {};
  if (tag) {
    where.tags = { has: tag };
  }

  // ✅ 1. Lấy dữ liệu (bỏ 'orderBy' của Prisma)
  let allRecipes = await prisma.recipe.findMany({
    where,
    // Bỏ 'orderBy' ở đây
  });

  // ✅ 2. Sắp xếp bằng JavaScript (không phân biệt hoa/thường)
  // Dùng 'localeCompare' với 'sensitivity: 'base'' sẽ bỏ qua
  // khác biệt hoa/thường và cả dấu tiếng Việt khi so sánh.
  allRecipes.sort((a, b) => {
    return a.title.localeCompare(b.title, "vi", { sensitivity: "base" });
  });

  // ✅ 3. Xử lý sort 'desc' (nếu có)
  // Đơn giản là đảo ngược lại mảng đã sort 'asc'
  if (sort === "desc") {
    allRecipes.reverse();
  }

  // ✅ 4. Search bỏ dấu (giữ nguyên như cũ)
  let filteredRecipes = allRecipes;
  if (search) {
    const s = removeVietnamese(search.toLowerCase());
    filteredRecipes = allRecipes.filter((r) =>
      removeVietnamese(r.title.toLowerCase()).includes(s)
    );
  }

  // Lấy total từ KẾT QUẢ đã filter
  const total = filteredRecipes.length;

  // Phân trang thủ công (slice) trên kết quả đã filter
  const recipes = filteredRecipes.slice(skip, skip + limit);

  return NextResponse.json({
    recipes,
    total,
  });
}

// ... (Hàm POST không thay đổi) ...
export async function POST(req: NextRequest) {
  // ...
}