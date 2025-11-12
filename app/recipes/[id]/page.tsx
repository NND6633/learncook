// app/recipes/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import hook session

export default function ViewRecipePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession(); // Lấy session

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await fetch(`/api/recipes/${id}`, { cache: "no-store" });

      if (!res.ok) {
        alert("Không tải được recipe. ID không tồn tại.");
        router.push("/recipes");
        return;
      }

      const data = await res.json();
      setRecipe(data);
      setLoading(false);
    };

    load();
  }, [id, router]);

  // ✅ SỬA LỖI: Bổ sung hàm 'remove'
  const remove = async () => {
    // 1. Xác nhận
    if (!confirm("Bạn có chắc muốn xóa recipe này không?")) return;

    // 2. Gọi API
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });

    // 3. Quay về trang chủ và làm mới
    router.push("/recipes");
    router.refresh();
  };

  if (loading) return <div className="p-6 text-lg">⏳ Đang tải...</div>;
  if (!recipe) return <div className="p-6 text-lg">Không tìm thấy recipe.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      {/* Nút điều khiển (Edit/Delete) */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">{recipe.title}</h1>
        <div className="flex gap-3">
          {/* Chỉ hiện nút nếu đã đăng nhập */}
          {session && (
            <>
              <Link
                href={`/recipes/${id}/edit`} // Link tới trang edit
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={remove} // ✅ Hàm 'remove' bây giờ đã tồn tại
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
              >
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hình ảnh */}
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          No Image
        </div>
      )}

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      <div>
        <h2 className="font-semibold text-xl mb-2">Ingredients</h2>
        <p className="bg-white p-4 border rounded-md whitespace-pre-wrap">
          {recipe.ingredients}
        </p>
      </div>

      <Link href="/recipes" className="text-blue-600 mt-5 inline-block">
        ← Back to all recipes
      </Link>
    </div>
  );
}