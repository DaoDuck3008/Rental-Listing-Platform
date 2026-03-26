"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getUserDetailForAdmin,
  toggleUserActiveByAdmin,
  updateUserRoleByAdmin,
} from "@/services/user.api";
import { getAllRoles } from "@/services/role.api";
import {
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  Shield,
  Clock,
  LayoutList,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Settings,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon,
} from "lucide-react";
import { formatVietnameseDate } from "@/utils/index";
import LoadingOverlay from "@/components/common/loadingOverlay";
import ListingTableBodyAdmin from "@/components/listing/listingTableBodyAdmin";
import WarningModal from "@/components/ui/warningModal";
import { toast } from "react-toastify";

interface UserDetail {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  gender?: string;
  avatar?: string;
  is_locked: boolean;
  createdAt: string;
  role: {
    code: string;
    name: string;
  };
  listings: any[];
}

export default function AdminUserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Pagination states for listings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingRole, setPendingRole] = useState("");

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await getUserDetailForAdmin(id);
      if (res.data && res.data.success) {
        setUser(res.data.data);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Không thể tải chi tiết người dùng";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles();
      if (res.success) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetail();
      fetchRoles();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      setActionLoading(true);
      await toggleUserActiveByAdmin(user.id);
      toast.success(
        user.is_locked
          ? "Đã mở khóa tài khoản người dùng"
          : "Đã khóa tài khoản người dùng"
      );
      fetchUserDetail();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi thay đổi trạng thái";
      toast.error(msg);
    } finally {
      setActionLoading(false);
      setShowStatusModal(false);
    }
  };

  const handleChangeRole = async () => {
    if (!user) return;
    try {
      setActionLoading(true);
      await updateUserRoleByAdmin(user.id, pendingRole);
      toast.success("Đã cập nhật vai trò người dùng");
      fetchUserDetail();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi cập nhật vai trò";
      toast.error(msg);
    } finally {
      setActionLoading(false);
      setShowRoleModal(false);
    }
  };

  const handleRoleSelect = (newRole: string) => {
    if (!user || newRole === user.role.code) return;
    setPendingRole(newRole);
    setShowRoleModal(true);
  };

  if (loading) return <LoadingOverlay />;
  if (!user) return <div className="p-8 text-center text-slate-500">Không tìm thấy người dùng.</div>;

  // Client-side pagination logic
  const totalItems = user.listings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = user.listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all"
              title="Quay lại"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hồ sơ người dùng</h1>
              <p className="text-sm text-slate-500 font-medium">ID: {user.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={() => setShowStatusModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                user.is_locked
                  ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
              }`}
            >
              {user.is_locked ? <Unlock size={18} /> : <Lock size={18} />}
              {user.is_locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </button>
          </div>
        </div>

        {/* User Stats/Info Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Avatar & Main Status */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background Decoration */}
             <div className={`absolute top-0 inset-x-0 h-24 ${user.is_locked ? 'bg-blue-500/5' : 'bg-rose-500/5'}`}></div>
             
             <div className="relative mt-4">
                <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden relative z-10">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.full_name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white z-20 shadow-sm ${user.is_locked ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
             </div>

             <h2 className="text-xl font-bold text-slate-900 mt-4 mb-1">{user.full_name}</h2>
             <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
               user.is_locked ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
             }`}>
               {user.is_locked ? 'Đã bị khóa' : 'Đang hoạt động'}
             </span>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Mail size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Email</span>
                      <span className="text-sm font-semibold text-slate-700 break-all">{user.email}</span>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Phone size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Số điện thoại</span>
                      <span className="text-sm font-semibold text-slate-700">{user.phone_number || "Chưa cập nhật"}</span>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Ngày tham gia</span>
                      <span className="text-sm font-semibold text-slate-700">{formatVietnameseDate(user.createdAt)}</span>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <LayoutList size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Số tin đăng</span>
                      <span className="text-sm font-semibold text-slate-700">{user.listings.length} bài viết</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Actions Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between gap-4">
             <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Settings size={14} /> Tùy chỉnh vai trò
                </h3>
                <div className="relative">
                  <select
                    value={user.role.code}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold cursor-pointer focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  >
                    {roles.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <Shield size={16} />
                  </div>
                </div>
             </div>
             <p className="text-[11px] text-slate-500 font-medium italic">
                * Thay đổi vai trò sẽ ảnh hưởng trực tiếp đến quyền hạn của người dùng trên hệ thống.
             </p>
          </div>
        </div>

        {/* Listings Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <LayoutList size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-900 text-lg">Danh sách bài đăng</h3>
                 <p className="text-xs text-slate-500 font-medium">Toàn bộ tin đăng đã được thiết lập bởi người dùng này.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               <span className="text-xs font-bold text-slate-600">Tổng cộng: {user.listings.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 min-w-80">Tin đăng</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Giá thuê</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.length > 0 ? (
                  currentItems.map((listing) => (
                    <ListingTableBodyAdmin
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      address={listing.address}
                      price={Number(listing.price)}
                      views={listing.views}
                      status={listing.status}
                      createdAt={listing.createdAt}
                      img_url={listing.images[0]?.image_url}
                      onRefresh={fetchUserDetail}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-2 text-slate-400">
                          <LayoutList size={40} className="opacity-20 mb-2" />
                          <p className="text-sm font-bold">Người dùng này chưa có bài đăng nào.</p>
                          <p className="text-xs">Mọi nội dung mới sẽ được hiển thị tại đây.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Pagination for Listings */}
          {totalPages > 1 && (
            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
               <p className="text-xs text-slate-500 font-bold">
                  Trang {currentPage} / {totalPages}
               </p>
               <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 disabled:opacity-40 transition-all shadow-sm"
                  >
                    <ChevronsLeftIcon size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 disabled:opacity-40 transition-all shadow-sm"
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <div className="flex items-center gap-1 mx-2">
                     {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                       <button
                         key={p}
                         onClick={() => setCurrentPage(p)}
                         className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
                           currentPage === p 
                           ? "bg-blue-500 text-white shadow-md shadow-blue-500/30" 
                           : "text-slate-500 hover:bg-white border border-transparent"
                         }`}
                       >
                         {p}
                       </button>
                     ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 disabled:opacity-40 transition-all shadow-sm"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 disabled:opacity-40 transition-all shadow-sm"
                  >
                    <ChevronsRightIcon size={16} />
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {showRoleModal && (
        <WarningModal
          title="Xác nhận thay đổi vai trò"
          message={`Bạn có chắc chắn muốn chuyển đổi vai trò của ${user.full_name} sang "${roles.find(r => r.code === pendingRole)?.name}"? Quyền truy cập của người dùng này sẽ thay đổi ngay lập tức.`}
          closeLabel="Hủy bỏ"
          submitLabel="Xác nhận thay đổi"
          OnClose={() => setShowRoleModal(false)}
          OnSubmit={handleChangeRole}
        />
      )}

      {showStatusModal && (
        <WarningModal
          title={user.is_locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          message={`Bạn có chắc chắn muốn ${user.is_locked ? 'mở khóa' : 'khóa'} tài khoản người dùng này? ${!user.is_locked ? 'Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa lại.' : ''}`}
          closeLabel="Quay lại"
          submitLabel={user.is_locked ? "Xác nhận Mở" : "Xác nhận Khóa"}
          OnClose={() => setShowStatusModal(false)}
          OnSubmit={handleToggleStatus}
        />
      )}

      {(loading || actionLoading) && <LoadingOverlay />}
    </main>
  );
}
