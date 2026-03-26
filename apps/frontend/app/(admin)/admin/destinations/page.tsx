"use client";

import LoadingOverlay from "@/components/common/loadingOverlay";
import DashboardCard from "@/components/common/dashboardCard";
import DestinationTableBodyAdmin from "@/components/destination/destinationTableBodyAdmin";
import {
  getAllDestinations,
  getDestinationStats,
} from "@/services/destination.api";
import {
  Search,
  RotateCcw,
  MapPin,
  University,
  Building2,
  Hotel,
  Trees,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { DestinationProps } from "@/types/destination.type";

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export default function AdminDestinationManagementPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const [limit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [destinations, setDestinations] = useState<DestinationProps[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState({
    UNIVERSITY: 0,
    MALL: 0,
    HOSPITAL: 0,
    PARK: 0,
    total: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await getDestinationStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message || "Không thể tải thống kê địa danh");
        return;
      }
      console.error("Failed to fetch destination stats", error);
      return;
    }
  };

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const result = await getAllDestinations({
        limit,
        page,
        keyword: debouncedKeyword,
        type: typeFilter,
      });
      const { data, pagination } = result.data;
      setDestinations(data);
      setPagination(pagination);
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message || "Không thể tải thống kê địa danh");
        return;
      }
      console.error("Failed to fetch destination stats", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  // Refresh cả list lẫn stats sau khi xóa
  const handleRefresh = async () => {
    await Promise.all([fetchDestinations(), fetchStats()]);
  };

  useEffect(() => {
    fetchDestinations();
  }, [page, typeFilter, debouncedKeyword]);

  const handleReset = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setTypeFilter("");
    setPage(1);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
              Quản lý địa danh phổ biến
            </h1>
            <p className="text-slate-500 text-base font-normal">
              Danh sách các vị trí trọng điểm hỗ trợ tìm kiếm phòng.
            </p>
          </div>
          <Link
            href="/admin/destinations/create"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <Plus size={20} />
            Thêm địa danh mới
          </Link>
        </div>

        {/* Stats Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Đại học"
            value={stats.UNIVERSITY}
            icon={University}
            iconColor="blue-600"
            bgIconColor="blue-50"
            textIconColor="blue-600"
          />
          <DashboardCard
            title="TT Thương mại"
            value={stats.MALL}
            icon={Building2}
            iconColor="emerald-600"
            bgIconColor="emerald-50"
            textIconColor="emerald-600"
          />
          <DashboardCard
            title="Bệnh viện"
            value={stats.HOSPITAL}
            icon={Hotel}
            iconColor="rose-600"
            bgIconColor="rose-50"
            textIconColor="rose-600"
          />
          <DashboardCard
            title="Công viên"
            value={stats.PARK}
            icon={Trees}
            iconColor="green-600"
            bgIconColor="green-50"
            textIconColor="green-600"
          />
        </div>

        {/* Search & Filter Area */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </span>
              <input
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
                placeholder="Tìm kiếm tên địa danh..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="min-w-45 h-11 px-3 appearance-none rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại địa danh</option>
                <option value="UNIVERSITY">Đại học</option>
                <option value="MALL">Trung tâm thương mại</option>
                <option value="HOSPITAL">Bệnh viện</option>
                <option value="PARK">Công viên</option>
              </select>
              <button
                onClick={handleReset}
                className="h-11 px-4 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center border border-slate-200"
                title="Làm mới"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Địa danh & Tọa độ
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Loại địa danh
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
                ) : destinations.length > 0 ? (
                  destinations.map((dest) => (
                    <DestinationTableBodyAdmin
                      key={dest.id}
                      id={dest.id}
                      name={dest.name}
                      type={dest.type}
                      longitude={dest.longitude}
                      latitude={dest.latitude}
                      onRefresh={handleRefresh}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy địa danh nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalItems
                )}{" "}
                / {pagination.totalItems}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (p) =>
                        Math.abs(p - page) <= 1 ||
                        p === 1 ||
                        p === pagination.totalPages
                    )
                    .map((p, idx, arr) => (
                      <div key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-slate-400 px-1">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                            page === p
                              ? "bg-blue-500 text-white"
                              : "text-slate-600 hover:bg-white border border-transparent"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, pagination.totalPages))
                  }
                  disabled={page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setPage(pagination.totalPages)}
                  disabled={page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </main>
  );
}
