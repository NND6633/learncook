import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Function helper lấy id
async function getId(context: any) {
  const { id } = await context.params; // Unwrap Promise
  const recipeId = Number(id);
  if (isNaN(recipeId)) return null;
  return recipeId;
}

/* ------------------ GET ------------------ */
export async function GET(req: NextRequest, context: any) {
  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }});
    if (!recipe) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("🔥 GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

/* ------------------ PUT ------------------ */
export async function PUT(req: NextRequest, context: any) {
  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await req.json();

    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: body.title,
        ingredients: body.ingredients,
        tags: body.tags ?? [],
        imageUrl: body.imageUrl ?? null
      },
    });

    return NextResponse.json(recipe);
  } catch (error: any) {
    console.error("🔥 PUT Error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy recipe" }, { status: 404 });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ------------------ DELETE ------------------ */
export async function DELETE(req: NextRequest, context: any) {
  try {
    const recipeId = await getId(context);
    if (!recipeId) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    await prisma.recipe.delete({ where: { id: recipeId }});

    return NextResponse.json({ message: "Đã xóa" });
  } catch (error: any) {
    console.error("🔥 DELETE Error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy recipe" }, { status: 404 });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
