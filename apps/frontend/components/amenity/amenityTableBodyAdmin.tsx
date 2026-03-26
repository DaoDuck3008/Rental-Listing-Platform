"use client";

import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAmenity } from "@/services/amenities.api";
import ConfirmDeleteModal from "@/components/listing/confirmDeleteModal";
import LoadingOverlay from "@/components/common/loadingOverlay";
import Link from "next/link";
import Icon from "@/components/ui/icon";

interface AmenityTableBodyAdminProps {
  id: string;
  name: string;
  icon: string;
  onRefresh?: () => void;
}

export default function AmenityTableBodyAdmin({
  id,
  name,
  icon,
  onRefresh,
}: AmenityTableBodyAdminProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      await deleteAmenity(id);
      setIsLoading(false);
      setOpenDeleteModal(false);
      toast.success("Đã xóa tiện ích thành công");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      setIsLoading(false);
      const res = error.response?.data;
      toast.error(res?.message || "Lỗi khi xóa tiện ích");
    }
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <Icon icon={icon as any} size={20} />
          </div>
          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
            {name}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{icon}</code>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/amenities/${id}/update`}
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            title="Sửa tiện ích"
          >
            <Pen size={17} />
          </Link>

          <button
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Xóa tiện ích"
            onClick={() => setOpenDeleteModal(true)}
          >
            <Trash2 size={18} />
          </button>
        </div>
        {openDeleteModal && (
          <ConfirmDeleteModal
            OnClose={() => setOpenDeleteModal(false)}
            OnSubmit={handleDelete}
          />
        )}
        {isLoading && <LoadingOverlay />}
      </td>
    </tr>
  );
}
