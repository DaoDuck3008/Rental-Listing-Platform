"use client";

import { Edit, Trash2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteRole } from "@/services/role.api";
import WarningModal from "../ui/warningModal";

interface RoleTableBodyAdminProps {
  id: string;
  code: string;
  name: string;
  onRefresh: () => void;
}

export default function RoleTableBodyAdmin({
  id,
  code,
  name,
  onRefresh,
}: RoleTableBodyAdminProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteRole(id);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);

      if (res.success) {
        toast.success("Xóa quyền hạn thành công!");
        onRefresh();
      }
    } catch (error: any) {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      const res = error.response?.data;
      toast.error(res?.message || "Đã có lỗi xảy ra khi xóa!");
    }
  };

  return (
    <>
      <tr className="group hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <ShieldCheck size={18} />
             </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {name}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">ID: {id}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider">
            {code}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/roles/${id}/update`}
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
              title="Chỉnh sửa"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Xóa"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {isDeleteModalOpen && (
            <WarningModal
              title="Xác nhận xóa quyền hạn"
              message={`Bạn có chắc chắn muốn xóa quyền hạn "${name}"? Thao tác này có thể ảnh hưởng đến người dùng hiện tại.`}
              OnClose={() => setIsDeleteModalOpen(false)}
              OnSubmit={handleDelete}
              submitLabel="Xác nhận xóa"
              closeLabel="Hủy"
            />
          )}
        </td>
      </tr>
    </>
  );
}
