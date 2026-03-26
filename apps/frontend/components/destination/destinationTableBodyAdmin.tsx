"use client";

import { MapPin, Pen, Trash2, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteDestination } from "@/services/destination.api";
import ConfirmDeleteModal from "@/components/listing/confirmDeleteModal";
import LoadingOverlay from "@/components/common/loadingOverlay";
import Link from "next/link";

import { DestinationProps } from "@/types/destination.type";

interface DestinationTableBodyAdminProps extends DestinationProps {
  onRefresh?: () => void;
}

export default function DestinationTableBodyAdmin({
  id,
  name,
  type,
  longitude,
  latitude,
  onRefresh,
}: DestinationTableBodyAdminProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      await deleteDestination(id);
      setIsLoading(false);
      setOpenDeleteModal(false);
      toast.success("Đã xóa địa danh thành công");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      setIsLoading(false);
      const res = error.response?.data;
      toast.error(res?.message || "Lỗi khi xóa địa danh");
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "UNIVERSITY":
        return "Đại học";
      case "MALL":
        return "Trung tâm thương mại";
      case "HOSPITAL":
        return "Bệnh viện";
      case "PARK":
        return "Công viên";
      default:
        return type;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "UNIVERSITY":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "MALL":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "HOSPITAL":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "PARK":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
            {name}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin size={12} />
            {latitude?.toFixed(6) || "0.000000"}, {longitude?.toFixed(6) || "0.000000"}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeStyle(
            type
          )}`}
        >
          {getTypeName(type)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Xem trên Google Maps"
          >
            <Globe size={18} />
          </a>

          <Link
            href={`/admin/destinations/${id}/update`}
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            title="Sửa địa danh"
          >
            <Pen size={17} />
          </Link>

          <button
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Xóa địa danh"
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
