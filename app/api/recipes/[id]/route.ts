// app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ✅ SỬA LỖI: Định nghĩa 'params' là một Promise
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// Hàm 'getId' (vẫn sử dụng 'await')
async function getId(context: RouteContext) {
  // 'context.params' là một Promise, cần 'await'
  const { id } = await context.params; // <-- Dòng này bây giờ khớp với type
  const recipeId = Number(id);
  if (isNaN(recipeId)) return null;
  return recipeId;
}

/* ------------------ GET ------------------ */
// Chữ ký hàm không đổi, vì nó dùng RouteContext
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("🔥 GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

/* ------------------ PUT ------------------ */
// Chữ ký hàm không đổi
export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: body.title,
        ingredients: body.ingredients,
        tags: body.tags ?? [],
        imageUrl: body.imageUrl ?? null,
      },
    });

    return NextResponse.json(recipe);
  } catch (error: any) {
    console.error("🔥 PUT Error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ------------------ DELETE ------------------ */
// Chữ ký hàm không đổi
export async function DELETE(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("🔥 DELETE Error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}