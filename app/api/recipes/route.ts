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

  // ✅ Filter TAG trong database
  const where: any = {};
  if (tag) {
    where.tags = { has: tag };
  }

  // ✅ Query từ DB trước
  let recipes = await prisma.recipe.findMany({
    where,
    skip,
    take: limit,
    orderBy: { title: sort === "asc" ? "asc" : "desc" },
  });

  // ✅ Search bỏ dấu sau khi lấy DB
  if (search) {
    const s = removeVietnamese(search.toLowerCase());
    recipes = recipes.filter((r) =>
      removeVietnamese(r.title.toLowerCase()).includes(s)
    );
  }

  const total = await prisma.recipe.count({ where });

  return NextResponse.json({
    recipes,
    total,
  });
}


export async function POST(req: NextRequest) {
  const data = await req.json();
  const recipe = await prisma.recipe.create({
    data: {
      ...data,
      tags: data.tags ?? [],
    },
  });
  return NextResponse.json(recipe);
}

