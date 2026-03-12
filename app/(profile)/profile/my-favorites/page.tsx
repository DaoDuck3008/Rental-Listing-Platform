"use client";

import ListingTableBody from "@/components/listing/listingTableBody";
import { getMyFavorites } from "@/services/user.api";
import { toggleFavoriteListing } from "@/services/listing.api";
import {
  ArrowDownWideNarrow,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handleError } from "@/utils";

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

export default function MyFavoritesPage() {
  const [limit, setLimit] = useState<number>(10);
  const [inputLimit, setInputLimit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const result = await getMyFavorites(limit, page);
      const { data, pagination } = result;
      
      const listingData = data.rows.map((row: any) => row.listing);
      
      setListings(listingData);
      setPagination(pagination);
    } catch (error: any) {
      handleError(error, "Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavoriteListing(listingId);
      toast.info("Đã xóa khỏi danh sách yêu thích");
      fetchFavorites();
    } catch (error: any) {
      handleError(error, "Có lỗi xảy ra khi cập nhật yêu thích");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page, limit]);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8 h-full">
        {/* Page Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
            Tin đăng đã lưu
          </h1>
          <p className="text-slate-500 text-base font-normal">
            Danh sách các tin đăng bạn đã đánh dấu yêu thích.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[300px]">
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
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : listings.length > 0 ? (
                  listings.map((listing) => (
                    <ListingTableBody
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      address={listing.address}
                      price={Number(listing.price)}
                      views={listing.views}
                      status={listing.status}
                      createdAt={listing.created_at}
                      img_url={listing.images[0]?.image_url}
                      onRefresh={fetchFavorites}
                      isFavorite={true}
                      onToggleFavorite={() => handleToggleFavorite(listing.id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      Bạn chưa lưu tin đăng nào.
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
                <p className="text-sm text-slate-500 whitespace-nowrap">
                  Hiển thị{" "}
                  {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.totalItems)}{" "}
                  trong {pagination.totalItems} tin | Mỗi trang:
                </p>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={inputLimit}
                  onChange={(e) => setInputLimit(e.target.value)}
                  onBlur={() => {
                    const val = parseInt(inputLimit);
                    if (isNaN(val) || val < 1) setInputLimit("1");
                    else if (val > 10) setInputLimit("10");
                  }}
                  className="w-16 h-8 px-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 1 || p === 1 || p === pagination.totalPages)
                    .map((p, index, array) => (
                      <div key={p} className="flex items-center">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="text-slate-400 px-1">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                            page === p
                              ? "bg-blue-500 text-white shadow-md"
                              : "text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent font-medium"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setPage(pagination.totalPages)}
                  disabled={page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
