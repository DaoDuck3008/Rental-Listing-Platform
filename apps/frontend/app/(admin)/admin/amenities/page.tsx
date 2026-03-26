"use client";

import LoadingOverlay from "@/components/common/loadingOverlay";
import AmenityTableBodyAdmin from "@/components/amenity/amenityTableBodyAdmin";
import { getAllAmenities } from "@/services/amenities.api";
import {
  Search,
  RotateCcw,
  Plus,
  LayoutGrid
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminAmenityManagementPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [amenities, setAmenities] = useState<any[]>([]);
  const [filteredAmenities, setFilteredAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const res = await getAllAmenities();
      if (res.success) {
        setAmenities(res.data);
        setFilteredAmenities(res.data);
      }
    } catch (error: any) {
      toast.error("Không thể tải danh sách tiện ích");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    const filtered = amenities.filter((a) =>
      a.name.toLowerCase().includes(keyword.toLowerCase()) ||
      a.icon.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredAmenities(filtered);
  }, [keyword, amenities]);

  const handleReset = () => {
    setKeyword("");
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
              Quản lý Tiện ích
            </h1>
            <p className="text-slate-500 text-base font-normal">
              Danh sách các tiện ích có sẵn cho các bài đăng.
            </p>
          </div>
          <Link
            href="/admin/amenities/create"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <Plus size={20} />
            Thêm tiện ích mới
          </Link>
        </div>

        {/* Search Area */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </span>
              <input
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
                placeholder="Tìm kiếm tên tiện ích..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button
              onClick={handleReset}
              className="h-11 px-4 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center border border-slate-200"
              title="Làm mới"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tiện ích
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mã biểu tượng (Lucide)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredAmenities.length > 0 ? (
                  filteredAmenities.map((amenity) => (
                    <AmenityTableBodyAdmin
                      key={amenity.id}
                      id={amenity.id}
                      name={amenity.name}
                      icon={amenity.icon}
                      onRefresh={fetchAmenities}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy tiện ích nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </main>
  );
}
