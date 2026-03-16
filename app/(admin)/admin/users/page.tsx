"use client";

import LoadingOverlay from "@/components/common/loadingOverlay";
import DashboardCard from "@/components/common/dashboardCard";
import UserTableBodyAdmin from "@/components/admin/UserTableBodyAdmin";
import { getAllUsersByAdmin, getUserStatsForAdmin } from "@/services/user.api";
import { getAllRoles } from "@/services/role.api";
import {
  Users,
  Search,
  ChevronsDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  UserPlus,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: {
    code: string;
    name: string;
  };
  is_active: boolean;
  avatar?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface Stats {
  total: number;
  newToday: number;
  blocked: number;
  landlords: number;
  tenants: number;
}

export default function AdminUserManagementPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [roles, setRoles] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [inputLimit, setInputLimit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);
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
      if (!isNaN(val) && val >= 1 && val <= 50) {
        setLimit(val);
        setPage(1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputLimit]);

  const fetchStats = async () => {
    try {
      const res = await getUserStatsForAdmin();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message);
      } else {
        console.error(error);
        toast.error("Lỗi khi tải thống kê người dùng");
      }
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles();
      if (res.success) {
        setRoles(res.data);
      }
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message);
      } else {
        console.error(error);
        toast.error("Lỗi khi tải danh sách vai trò");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsersByAdmin({
        limit,
        page,
        keyword: debouncedKeyword,
        role: roleFilter,
        statusFilter: statusFilter,
      });
      const { data, pagination } = result.data;
      setUsers(data);
      setPagination(pagination);
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message);
      } else {
        console.error(error);
        toast.error("Lỗi khi tải danh sách người dùng");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleFilter, statusFilter, debouncedKeyword]);

  const handleReset = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
            Quản lý Người dùng
          </h1>
          <p className="text-slate-500 text-base font-normal">
            Hệ thống quản trị tài khoản người dùng trên toàn nền tảng.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Tổng người dùng"
            value={stats?.total || 0}
            icon={Users}
            iconColor="blue-600"
            bgIconColor="blue-50"
            textIconColor="blue-600"
            iconSize={22}
          />
          <DashboardCard
            title="Mới hôm nay"
            value={stats?.newToday || 0}
            icon={UserPlus}
            iconColor="emerald-600"
            bgIconColor="emerald-50"
            textIconColor="emerald-600"
            iconSize={22}
          />
          <DashboardCard
            title="Chủ trọ"
            value={stats?.landlords || 0}
            icon={ShieldCheck}
            iconColor="indigo-600"
            bgIconColor="indigo-50"
            textIconColor="indigo-600"
            iconSize={22}
          />
          <DashboardCard
            title="Số tài khoản bị khóa"
            value={stats?.blocked || 0}
            icon={UserX}
            iconColor="rose-600"
            bgIconColor="rose-50"
            textIconColor="rose-600"
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
                placeholder="Tìm kiếm tên, email, số điện thoại..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="min-w-45 relative">
                <select
                  className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Tất cả vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.code}>
                      {role.name}
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
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="blocked">Đã bị khóa</option>
                </select>
                <ChevronsDown
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
        </div>

        {/* Table Area */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-64">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Liên hệ
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <UserTableBodyAdmin
                      key={user.id}
                      id={user.id}
                      fullName={user.full_name}
                      email={user.email}
                      phoneNumber={user.phone_number}
                      roleCode={user.role.code}
                      isActive={user.is_active}
                      avatar={user.avatar}
                      createdAt={user.createdAt}
                      roles={roles}
                      onRefresh={() => {
                        fetchUsers();
                        fetchStats();
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy người dùng nào.
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
                  max={50}
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
