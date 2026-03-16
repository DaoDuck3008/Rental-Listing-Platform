"use client";

import { useState, useEffect } from "react";
import { getAuditLogs } from "@/services/auditLog.api";
import { Search, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data: any;
  new_data: any;
  ip_address: string;
  user_agent: string;
  createdAt: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar: string;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [userIdFilter, setUserIdFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");

  const fetchLogs = async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await getAuditLogs({
        page: currentPage,
        limit: 15,
        userId: userIdFilter || undefined,
        action: actionFilter || undefined,
        entityType: entityTypeFilter || undefined,
      });
      setLogs(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      toast.error("Lỗi khi tải lịch sử hoạt động");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs(1);
  };

  const clearFilters = () => {
    setUserIdFilter("");
    setActionFilter("");
    setEntityTypeFilter("");
    setPage(1);
    setTimeout(() => {
      fetchLogs(1);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Lịch sử hoạt động (Audit Logs)
        </h1>
        <p className="text-slate-500 mt-1">
          Giám sát toàn bộ các thay đổi trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              User ID
            </label>
            <input
              type="text"
              placeholder="Nhập ID người dùng"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Action
            </label>
            <input
              type="text"
              placeholder="VD: UPDATE_USER"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Entity Type
            </label>
            <input
              type="text"
              placeholder="VD: User, Listing"
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <Search size={16} /> Lọc
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              <RefreshCcw />
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="font-semibold text-slate-600 px-6 py-4 text-sm">
                    Thời gian
                  </th>
                  <th className="font-semibold text-slate-600 px-6 py-4 text-sm">
                    Người dùng
                  </th>
                  <th className="font-semibold text-slate-600 px-6 py-4 text-sm">
                    Action
                  </th>
                  <th className="font-semibold text-slate-600 px-6 py-4 text-sm">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => window.location.href = `/admin/audit-logs/${log.id}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {log.user ? (
                            <>
                              <img
                                src={log.user.avatar || "/placeholder.png"}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">
                                  {log.user.full_name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {log.user_id}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-slate-500 italic">
                              Hệ thống ({log.user_id})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 w-max">
                            {log.action}
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            {log.entity_type} ({log.entity_id})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {log.ip_address}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500 text-sm"
                    >
                      Không tìm thấy log nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
            <span className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-semibold text-slate-700">
                {logs.length}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
              bản ghi
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </button>
              <span className="text-sm font-semibold text-slate-700 px-3">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
