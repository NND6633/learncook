"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipe() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const defaultTags = ["Vegan", "Healthy", "Dessert", "Breakfast"];

  const addTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag)) return;
    setTags([...tags, tag.trim()]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const submit = async () => {
    await fetch("/api/recipes", {
      method: "POST",
      body: JSON.stringify({
        title,
        ingredients,
        tags,
        imageUrl,
      }),
    });

    router.push("/recipes");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="font-bold text-2xl">➕ Add New Recipe</h1>

      <div className="space-y-2">
        <label className="font-semibold">Title</label>
        <input className="border p-2 w-full rounded" placeholder="Recipe title"
          value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Ingredients</label>
        <textarea className="border p-2 w-full rounded" rows={4}
          placeholder="List ingredients..."
          value={ingredients} onChange={e => setIngredients(e.target.value)} />
      </div>

      {/* ✅ Tags Select & Add */}
      <div className="space-y-2">
        <label className="font-semibold">Tags</label>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded flex-1"
            onChange={(e) => addTag(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a tag</option>
            {defaultTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            className="border p-2 rounded flex-1"
            placeholder="Add custom tag"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
          />

          <button
            onClick={() => addTag(newTag)}
            className="px-3 bg-green-600 text-white rounded"
          >
            +
          </button>
        </div>

        {/* ✅ Tag Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Image URL</label>
        <input className="border p-2 w-full rounded" placeholder="https://..."
          value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
        onClick={submit}
      >
        ✅ Save Recipe
      </button>
    </div>
  );
}
