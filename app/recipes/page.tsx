"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("asc");

  const totalPages = Math.ceil(total / pageSize);

  const load = async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      search,
      tag,
      sort
    });

    const res = await fetch(`/api/recipes?${params.toString()}`, {
      cache: "no-store",
    });

    const data = await res.json();
    setRecipes(data.recipes);
    setTotal(data.total);
  };

  useEffect(() => { load(); }, [page, search, tag, sort]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">🍽️ Recipe App</Link>
        <Link href="/recipes/new" className="bg-green-600 text-white px-4 py-2 rounded">
          + Add Recipe
        </Link>
      </div>

      {/* Search / Filter / Sort */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="border p-2 rounded w-60"
        />

        <select
          value={tag}
          onChange={(e) => {
            setPage(1);
            setTag(e.target.value);
          }}
          className="border p-2 rounded w-40"
        >
          <option value="">All Tags</option>
          <option value="Vegan">Vegan</option>
          <option value="Healthy">Healthy</option>
          <option value="Dessert">Dessert</option>
          <option value="Breakfast">Breakfast</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Sort A → Z</option>
          <option value="desc">Sort Z → A</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recipes.map((r) => (
          <div key={r.id} className="border rounded p-4 shadow bg-white">

            {r.imageUrl ? (
              <img src={r.imageUrl} className="w-full h-40 object-cover rounded mb-2" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                No Image
              </div>
            )}

            <h2 className="text-lg font-semibold">{r.title}</h2>
            <p className="text-sm text-gray-600">
              {r.tags?.length ? r.tags.join(", ") : "No tags"}
            </p>

            <Link href={`/recipes/${r.id}`} className="text-blue-600 mt-2 inline-block">
              ✏️ Edit Recipe
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className="px-3 py-2 bg-gray-300 rounded">←</button>
          )}

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {page < totalPages && (
            <button onClick={() => setPage(page + 1)} className="px-3 py-2 bg-gray-300 rounded">→</button>
          )}
        </div>
      )}
    </div>
  );
}
