"use client";

import LoadingOverlay from "@/components/common/loadingOverlay";
import DashboardCard from "@/components/common/dashboardCard";
import ListingTableBodyAdmin from "@/components/listing/listingTableBodyAdmin";
import { getAllListingsByAdmin, getListingStats } from "@/services/listing.api";
import {
  ArrowDownWideNarrow,
  Search,
  ChevronsDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  LayoutList,
  CheckCircle2,
  Clock,
  Edit3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useListingTypes } from "@/hooks/useListingTypes";
import { getVietnameseStatus } from "@/utils/constants";

interface Listing {
  id: string;
  title: string;
  price: string;
  address: string;
  views: number;
  status: string;
  created_at: string;
  images: { image_url: string }[];
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface Stats {
  total: number;
  published: number;
  pending: number;
  editDraft: number;
}

export default function AdminListingManagementPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [listingTypeFilter, setListingTypeFilter] = useState<string>("");
  const [sortFilter, setSortFilter] = useState<string>("DATE_DESC");

  const { listingTypes } = useListingTypes();

  const [limit, setLimit] = useState<number>(10);
  const [inputLimit, setInputLimit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Debounce limit input
  useEffect(() => {
    const timer = setTimeout(() => {
      const val = parseInt(inputLimit);
      if (!isNaN(val) && val >= 1 && val <= 10) {
        setLimit(val);
        setPage(1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputLimit]);

  const fetchStats = async () => {
    try {
      const res = await getListingStats();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      } else {
        console.error("Stats API returned success:false", res.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error("Không thể tải thống kê bài đăng");
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const result = await getAllListingsByAdmin({
        limit,
        page,
        keyword: debouncedKeyword,
        listing_type_code: listingTypeFilter,
        status: statusFilter,
        sort_by: sortFilter,
      });
      const { data, pagination } = result.data;
      setListings(data);
      setPagination(pagination);
    } catch (error: any) {
      console.error(error);
      toast.error("Không thể tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [
    page,
    limit,
    statusFilter,
    debouncedKeyword,
    sortFilter,
    listingTypeFilter,
  ]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleListingTypeChange = (typeCode: string) => {
    setListingTypeFilter(typeCode);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortFilter(sort);
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setStatusFilter("");
    setListingTypeFilter("");
    setSortFilter("DATE_DESC");
    setPage(1);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
            Quản lý toàn bộ tin đăng
          </h1>
          <p className="text-slate-500 text-base font-normal">
            Hệ thống quản trị danh sách tin đăng trên toàn nền tảng.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Tổng bài đăng"
            value={stats?.total || 0}
            icon={LayoutList}
            iconColor="blue-600"
            bgIconColor="blue-50"
            textIconColor="blue-600"
            iconSize={22}
          />
          <DashboardCard
            title="Đang hiển thị"
            value={stats?.published || 0}
            icon={CheckCircle2}
            iconColor="emerald-600"
            bgIconColor="emerald-50"
            textIconColor="emerald-600"
            iconSize={22}
          />
          <DashboardCard
            title="Chờ duyệt mới"
            value={stats?.pending || 0}
            icon={Clock}
            iconColor="amber-600"
            bgIconColor="amber-50"
            textIconColor="amber-600"
            iconSize={22}
          />
          <DashboardCard
            title="Chờ duyệt sửa"
            value={stats?.editDraft || 0}
            icon={Edit3}
            iconColor="indigo-600"
            bgIconColor="indigo-50"
            textIconColor="indigo-600"
            iconSize={22}
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
                placeholder="Tìm kiếm tiêu đề, địa chỉ, người đăng..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="min-w-45 relative">
                <select
                  className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                  value={listingTypeFilter}
                  onChange={(e) => handleListingTypeChange(e.target.value)}
                >
                  <option value="">Tất cả loại phòng</option>
                  {listingTypes?.map((type: any) => (
                    <option key={type.code} value={type.code}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronsDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
              <div className="min-w-45 relative">
                <select
                  className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                  value={sortFilter}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="DATE_DESC">Sắp xếp: Mới nhất</option>
                  <option value="DATE_ASC">Sắp xếp: Cũ nhất</option>
                  <option value="PRICE_DESC">Giá: Cao đến thấp</option>
                  <option value="PRICE_ASC">Giá: Thấp đến cao</option>
                  <option value="VIEWS_DESC">Lượt xem: Nhiều nhất</option>
                </select>
                <ArrowDownWideNarrow
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
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

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {[
              "",
              "PUBLISHED",
              "PENDING",
              "EDIT_DRAFT",
              "HIDDEN",
              "EXPIRED",
              "REJECTED",
              "SOFT_DELETED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status === "" ? "Tất cả" : getVietnameseStatus(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Area */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-75">
                    Tin đăng
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Giá thuê
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Thống kê
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Trạng thái
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
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : listings.length > 0 ? (
                  listings.map((listing) => (
                    <ListingTableBodyAdmin
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      address={listing.address}
                      price={Number(listing.price)}
                      views={listing.views}
                      status={listing.status}
                      createdAt={listing.created_at}
                      img_url={listing.images[0]?.image_url}
                      onRefresh={fetchListings}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy tin đăng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalItems
                  )}{" "}
                  / {pagination.totalItems} | Mỗi trang:
                </p>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={inputLimit}
                  onChange={(e) => setInputLimit(e.target.value)}
                  className="w-16 h-8 px-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

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
