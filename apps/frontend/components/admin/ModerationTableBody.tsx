"use client";

import {
  Check,
  X as CloseIcon,
  Eye,
  Users,
  MapPin,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import {
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
  formatTimeAgo,
} from "@/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { approveListing, rejectListing } from "@/services/listing.api";
import LoadingOverlay from "../common/loadingOverlay";
import Link from "next/link";

interface ModerationTableBodyProps {
  id: string;
  img_url?: string;
  title: string;
  creator_name: string;
  address: string;
  price: number;
  createdAt: string;
  status: string;
  onRefresh: () => void;
}

export default function ModerationTableBody({
  id,
  img_url,
  title,
  creator_name,
  address,
  price,
  createdAt,
  status,
  onRefresh,
}: ModerationTableBodyProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveListing(id);
      toast.success("Đã duyệt bài đăng thành công!");
      onRefresh();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi duyệt bài."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Bạn có chắc chắn muốn từ chối bài đăng này?")) return;
    try {
      setIsLoading(true);
      await rejectListing(id);
      toast.success(" Đã từ chối bài đăng.");
      onRefresh();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi từ chối bài."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const vietnameseStatus = getVietnameseStatus(status);
  const statusStyle = getStatusStyle(status);
  const formattedPrice = formatVietnamesePrice(price);
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div
          className="w-16 h-16 rounded-xl bg-cover bg-center border border-slate-200 shadow-sm shrink-0"
          style={{
            backgroundImage: `url(${img_url || "/NoImage.jpg"})`,
          }}
        ></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 max-w-md">
          <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserIcon size={14} className="text-slate-400" />
            <span className="font-medium">{creator_name}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-blue-600 font-display">
            {formattedPrice}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-50">
            <MapPin size={12} className="shrink-0" />
            {address}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
        >
          {vietnameseStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
        {timeAgo}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 items-center">
          {status === "EDIT_DRAFT" ? (
            <Link
              href={`/admin/moderation/${id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group/btn"
              title="Xem và So sánh"
            >
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span className="text-xs font-bold whitespace-nowrap">
                Xem & So sánh
              </span>
            </Link>
          ) : (
            <>
              <Link
                href={`/admin/moderation/${id}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                title="Xem chi tiết"
              >
                <Eye size={18} />
              </Link>
              <button
                onClick={handleReject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-transparent hover:border-red-200 hover:bg-red-100 transition-all"
                title="Từ chối"
              >
                <CloseIcon size={16} />
                <span className="text-xs font-bold">Huỷ</span>
              </button>
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-transparent hover:border-emerald-200 hover:bg-emerald-100 transition-all font-bold text-xs"
                title="Duyệt"
              >
                <Check size={16} />
                <span>Duyệt</span>
              </button>
            </>
          )}
        </div>
        {isLoading && <LoadingOverlay />}
      </td>
    </tr>
  );
}
