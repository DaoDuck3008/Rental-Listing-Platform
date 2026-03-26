"use client";

import { Edit, Trash2, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteListingType } from "@/services/listingType.api";
import WarningModal from "../ui/warningModal";

interface ListingTypeTableBodyAdminProps {
  id: string;
  code: string;
  name: string;
  description: string | null;
  onRefresh: () => void;
}

export default function ListingTypeTableBodyAdmin({
  id,
  code,
  name,
  description,
  onRefresh,
}: ListingTypeTableBodyAdminProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteListingType(id);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);

      if (res.success) {
        toast.success("Xóa loại bài đăng thành công!");
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
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
              {name}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">ID: {id}</p>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            {code}
          </span>
        </td>
        <td className="px-6 py-4">
          <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">
            {description || "Không có mô tả"}
          </p>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/listing-types/${id}/update`}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
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
              title="Xác nhận xóa loại bài đăng"
              message={`Bạn có chắc chắn muốn xóa loại bài đăng "${name}"? Hành động này không thể hoàn tác.`}
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
