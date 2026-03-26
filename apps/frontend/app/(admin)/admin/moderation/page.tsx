"use client";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getListingsForModeration } from "@/services/listing.api";
import ModerationTableBody from "@/components/admin/ModerationTableBody";

interface Listing {
  id: string;
  title: string;
  price: string;
  address: string;
  status: string;
  created_at: string;
  images: { image_url: string }[];
  owner: { full_name: string };
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export default function ModerationPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [inputLimit, setInputLimit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Debounce limit input
  useEffect(() => {
    const timer = setTimeout(() => {
      const val = parseInt(inputLimit);
      if (!isNaN(val) && val >= 1 && val <= 50) {
        setLimit(val);
        setPage(1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputLimit]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const result = await getListingsForModeration({
        limit,
        page,
        status: statusFilter,
        keyword: debouncedKeyword,
      });
      const data = result.data;

      setListings(data.data);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách kiểm duyệt."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchKeyword("");
    setDebouncedKeyword("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    fetchListings();
  }, [page, limit, statusFilter, debouncedKeyword]);

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Danh Sách Bài Đăng Chờ Duyệt
        </h2>
      </div>

      {/* Filters and Search Container */}
      <div className="p-4 mt-2 mb-8 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </span>
            <input
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
              placeholder="Tìm theo tiêu đề, địa chỉ, người đăng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          {/* Tab Filters */}
          <div className="flex gap-2 p-1 bg-slate-50 rounded-lg border border-slate-100 items-center overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === ""
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                statusFilter === "PENDING"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              <span className={`w-2 h-2 rounded-full bg-amber-500`}></span>
              Bài mới
            </button>
            <button
              onClick={() => setStatusFilter("EDIT_DRAFT")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                statusFilter === "EDIT_DRAFT"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              <span className={`w-2 h-2 rounded-full bg-blue-500`}></span>
              Cập nhật
            </button>
          </div>
          <button
            onClick={handleReset}
            className="h-11 px-4 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200 shadow-sm"
            title="Làm mới bộ lọc"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-12">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ảnh
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                  Thông tin bài đăng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                  Giá & Địa chỉ
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center font-display">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right font-display">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : listings.length > 0 ? (
                listings.map((listing) => (
                  <ModerationTableBody
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    creator_name={listing.owner?.full_name || "Người dùng"}
                    address={listing.address}
                    price={Number(listing.price)}
                    status={listing.status}
                    createdAt={listing.created_at}
                    img_url={listing.images[0]?.image_url}
                    onRefresh={fetchListings}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Không tìm thấy bài đăng nào cần kiểm duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500 whitespace-nowrap">
              Hiển thị{" "}
              {pagination ? (pagination.page - 1) * pagination.limit + 1 : 0} -{" "}
              {pagination
                ? Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalItems
                  )
                : 0}{" "}
              trong {pagination?.totalItems || 0} bài | Mỗi trang:
            </p>
            <input
              type="number"
              min={1}
              max={50}
              value={inputLimit}
              onChange={(e) => setInputLimit(e.target.value)}
              onBlur={() => {
                const val = parseInt(inputLimit);
                if (isNaN(val) || val < 1) setInputLimit("1");
                else if (val > 50) setInputLimit("50");
              }}
              className="w-16 h-8 px-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Trang đầu"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1 mx-1">
              {pagination &&
                Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      Math.abs(p - page) <= 1 ||
                      p === 1 ||
                      p === pagination.totalPages
                  )
                  .map((p, index, array) => (
                    <div key={p} className="flex items-center">
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="text-slate-400 px-1">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                          page === p
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}
            </div>

            <button
              onClick={() =>
                setPage((p) => Math.min(pagination?.totalPages || 1, p + 1))
              }
              disabled={page === (pagination?.totalPages || 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(pagination?.totalPages || 1)}
              disabled={page === (pagination?.totalPages || 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Trang cuối"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
