"use client";

import LoadingOverlay from "@/components/common/loadingOverlay";
import ListingTypeTableBodyAdmin from "@/components/listingType/listingTypeTableBodyAdmin";
import { getAllListingTypes } from "@/services/listingType.api";
import {
  Search,
  RotateCcw,
  Plus,
  Layers
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminListingTypeManagementPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [listingTypes, setListingTypes] = useState<any[]>([]);
  const [filteredListingTypes, setFilteredListingTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchListingTypes = async () => {
    try {
      setLoading(true);
      const res = await getAllListingTypes();
      if (res.success) {
        setListingTypes(res.data);
        setFilteredListingTypes(res.data);
      }
    } catch (error: any) {
      toast.error("Không thể tải danh sách loại bài đăng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingTypes();
  }, []);

  useEffect(() => {
    const filtered = listingTypes.filter((lt) =>
      lt.name.toLowerCase().includes(keyword.toLowerCase()) ||
      lt.code.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredListingTypes(filtered);
  }, [keyword, listingTypes]);

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
              Quản lý Loại bài đăng
            </h1>
            <p className="text-slate-500 text-base font-normal">
              Định nghĩa các kiểu hình cho thuê (Ví dụ: Căn hộ, Nhà nguyên căn, Phòng trọ...)
            </p>
          </div>
          <Link
            href="/admin/listing-types/create"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <Plus size={20} />
            Thêm loại mới
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
                placeholder="Tìm kiếm theo tên hoặc mã..."
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
                    Tên loại hình
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mã (Code)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mô tả
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
                      colSpan={4}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredListingTypes.length > 0 ? (
                  filteredListingTypes.map((type) => (
                    <ListingTypeTableBodyAdmin
                      key={type.id}
                      id={type.id}
                      name={type.name}
                      code={type.code}
                      description={type.description}
                      onRefresh={fetchListingTypes}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy loại bài đăng nào.
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
