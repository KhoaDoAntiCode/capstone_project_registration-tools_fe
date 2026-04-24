"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  englishName: string;
  vietnameseName: string;
  abbreviation: string;
  isEnterpriseProject: boolean;
  isResearchProject: boolean;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const router = useRouter();

useEffect(() => {
  const token = localStorage.getItem("accessToken");

  fetch("https://localhost:7148/api/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Unauthorized or failed");
      }
      return res.json();
    })
    .then((data) => {
      setProjects(data);
      setFiltered(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => setLoading(false));
}, []);
  // 🔍 Search filter
  useEffect(() => {
    const keyword = search.toLowerCase();

    setFiltered(
      projects.filter(
        (p) =>
          p.englishName.toLowerCase().includes(keyword) ||
          p.vietnameseName.toLowerCase().includes(keyword)
      )
    );
  }, [search, projects]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚 Danh sách đề tài</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          + Tạo đề tài
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm đề tài..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          ⏳ Đang tải dữ liệu...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Không có đề tài nào 😢
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/projects/${p.id}`)}
              className="cursor-pointer bg-white border rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* TITLE */}
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {p.englishName}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {p.vietnameseName}
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mb-4">
                {p.isEnterpriseProject && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Enterprise
                  </span>
                )}
                {p.isResearchProject && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Research
                  </span>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{p.abbreviation}</span>
                <span>→ Xem chi tiết</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}