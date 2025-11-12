// app/recipes/[id]/edit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
// ✅ Đổi tên component cho rõ ràng
export default function EditRecipePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const defaultTags = ["Vegan", "Healthy", "Dessert", "Breakfast"];

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await fetch(`/api/recipes/${id}`, { cache: "no-store" });

      if (!res.ok) {
        alert("Không tải được recipe. ID không tồn tại");
        router.push("/recipes");
        return;
      }

      const data = await res.json();
      setTitle(data.title);
      setIngredients(data.ingredients);
      setTags(data.tags ?? []);
      setImageUrl(data.imageUrl || "");
      setLoading(false);
    };

    load();
  }, [id, router]);

  const addTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag)) return;
    setTags([...tags, tag.trim()]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const save = async () => {
    await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        ingredients,
        tags,
        imageUrl,
      }),
    });

    // ✅ Sau khi lưu, quay lại trang view
    router.push(`/recipes/${id}`);
    router.refresh();
  };

  // ❌ Đã XÓA nút/hàm 'remove'
  // Nút Delete sẽ nằm ở trang View

  if (loading) return <div className="p-6 text-lg">⏳ Đang tải...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="font-bold text-2xl mb-2">✏️ Edit Recipe</h1>

      <div className="space-y-2">
        <label className="font-semibold">Title</label>
        <input
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Ingredients</label>
        <textarea
          className="border p-2 w-full rounded"
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>

      {/* Tag selector */}
      <div className="space-y-2">
        <label className="font-semibold">Tags</label>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded flex-1"
            onChange={(e) => addTag(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select tag
            </option>
            {defaultTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded flex-1"
            placeholder="Add custom tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />

          <button
            onClick={() => addTag(newTag)}
            className="px-3 bg-green-600 text-white rounded"
          >
            +
          </button>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
                className="text-red-600 font-bold"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="font-semibold">Image URL</label>
        <input
          className="border p-2 w-full rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          className="w-full h-48 object-cover rounded shadow"
          alt={title}
        />
      )}

      {/* Buttons */}
      <div className="flex justify-between pt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={save}
        >
          💾 Save Changes
        </button>

        {/* ✅ Quay lại trang View (không phải danh sách) */}
        <Link
          href={`/recipes/${id}`}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}