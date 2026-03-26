"use client";

import {
  Eye,
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  Lock,
  Unlock,
} from "lucide-react";
import { formatVietnameseDate } from "@/utils/index";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingOverlay from "../common/loadingOverlay";
import WarningModal from "../ui/warningModal";
import {
  toggleUserActiveByAdmin,
  updateUserRoleByAdmin,
} from "@/services/user.api";

interface UserTableBodyAdminProps {
  id: string;
  avatar?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleCode: string;
  isActive: boolean;
  createdAt: string;
  roles: any[];
  onRefresh?: () => void;
}

export default function UserTableBodyAdmin({
  id,
  avatar,
  fullName,
  email,
  phoneNumber,
  roleCode,
  isActive,
  createdAt,
  roles,
  onRefresh,
}: UserTableBodyAdminProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [pendingRole, setPendingRole] = useState<string>("");

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      await toggleUserActiveByAdmin(id);
      toast.success(
        isActive
          ? "Đã mở khóa tài khoản người dùng"
          : "Đã khóa tài khoản người dùng"
      );
      if (onRefresh) onRefresh();
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message);
      } else {
        console.error(error);
        toast.error("Lỗi khi thay đổi trạng thái người dùng");
      }
    } finally {
      setIsLoading(false);
      setShowStatusModal(false);
    }
  };

  const handleChangeRole = async () => {
    try {
      setIsLoading(true);
      await updateUserRoleByAdmin(id, pendingRole);
      toast.success("Đã cập nhật vai trò người dùng");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      const res = error.response.data;
      if (res) {
        toast.error(res.message);
      } else {
        console.error(error);
        toast.error("Lỗi khi cập nhật vai trò người dùng");
      }
    } finally {
      setIsLoading(false);
      setShowRoleModal(false);
    }
  };

  const handleRoleSelect = (newRole: string) => {
    if (newRole === roleCode) return;
    setPendingRole(newRole);
    setShowRoleModal(true);
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            {avatar ? (
              <img
                src={avatar}
                className="w-full h-full object-cover"
                alt={fullName}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <UserIcon size={24} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <Link
              href={`/admin/users/${id}`}
              className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              {fullName}
            </Link>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Mail size={12} /> {email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-700 flex items-center gap-1 whitespace-nowrap">
          <Phone size={14} className="text-slate-400" />
          {phoneNumber || "Chưa cập nhật"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="relative inline-block">
          <select
            value={roleCode}
            onChange={(e) => handleRoleSelect(e.target.value)}
            className={`text-xs font-semibold py-1.5 px-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer ${
              roleCode === "ADMIN"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : roleCode === "LANDLORD"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-slate-50 text-slate-700"
            }`}
          >
            {roles.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => setShowStatusModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
            !isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              !isActive ? "bg-emerald-500" : "bg-red-500"
            }`}
          ></span>
          {!isActive ? "Hoạt động" : "Bị khóa"}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 text-xs text-slate-500 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {formatVietnameseDate(createdAt)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/users/${id}`}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={() => setShowStatusModal(true)}
            className={`p-2 rounded-lg transition-colors ${
              !isActive
                ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
            }`}
            title={!isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          >
            {!isActive ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
        </div>
      </td>

      {showRoleModal && (
        <WarningModal
          title="Xác nhận thay đổi vai trò"
          message={`Bạn có chắc chắn muốn thay đổi vai trò của người dùng ${fullName} sang ${
            roles.find((r) => r.code === pendingRole)?.name
          }? Việc này có thể ảnh hưởng đến quyền hạn truy cập hệ thống của họ.`}
          closeLabel="Hủy"
          submitLabel="Xác nhận thay đổi"
          OnClose={() => setShowRoleModal(false)}
          OnSubmit={handleChangeRole}
        />
      )}

      {showStatusModal && (
        <WarningModal
          title={isActive ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          message={`Bạn có chắc chắn muốn ${
            isActive ? "mở khóa" : "khóa"
          } tài khoản của ${fullName}? ${
            !isActive
              ? "Người dùng này sẽ không thể đăng nhập vào hệ thống!"
              : "Người dùng sẽ có thể truy cập lại hệ thống bình thường."
          }`}
          closeLabel="Hủy"
          submitLabel={isActive ? "Mở khóa" : "Khóa tài khoản"}
          OnClose={() => setShowStatusModal(false)}
          OnSubmit={handleToggleStatus}
        />
      )}

      {isLoading && <LoadingOverlay />}
    </tr>
  );
}
