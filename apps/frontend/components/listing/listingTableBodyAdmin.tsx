import {
  CalendarFold,
  Eye,
  MapPin,
  Pen,
  Trash2,
} from "lucide-react";
import {
  formatVietnameseDate,
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
  formatViews,
} from "@/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { hardDeleteListingAdmin } from "@/services/listing.api";
import ConfirmDeleteModal from "./confirmDeleteModal";
import Link from "next/link";
import LoadingOverlay from "../common/loadingOverlay";

interface ListingTableBodyAdminProps {
  id: string;
  img_url?: string;
  title: string;
  address: string;
  price: number;
  createdAt?: string;
  views: string | number;
  status?: string;
  onRefresh?: () => void;
}

export default function ListingTableBodyAdmin({
  id,
  img_url,
  title,
  address,
  price,
  createdAt,
  views,
  status,
  onRefresh,
}: ListingTableBodyAdminProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleHardDelete = async () => {
    try {
      setIsLoading(true);
      await hardDeleteListingAdmin(id);
      setIsLoading(false);
      setOpenDeleteModal(false);
      toast.success("Đã xóa vĩnh viễn bài đăng");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      setIsLoading(false);
      const res = error.response?.data;
      toast.error(res?.message || "Lỗi khi xóa bài đăng");
    }
  };

  // Lấy trạng thái tiếng Việt
  const vietnameseStatus = getVietnameseStatus(status);

  // Lấy style cho trạng thái
  const statusStyle = getStatusStyle(status);

  // Format ngày tháng
  const formattedDate = formatVietnameseDate(createdAt);

  // Format giá tiền
  const formattedPrice = formatVietnamesePrice(price);

  // Format số lượt xem
  const formattedViews = formatViews(views);

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex gap-4 items-start">
          <div className=" rounded-lg bg-slate-200 overflow-hidden shrink-0">
            <img
              src={img_url || "/NoImage.jpg"}
              className="object-cover w-20 h-16"
              alt={title}
            />
          </div>
          <Link
            href={`/admin/listings/${id}`}
            className="flex flex-col gap-1 cursor-pointer"
          >
            <p className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-500 transition-colors">
              {title}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin size={12} />
              {address}
            </p>
          </Link>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="block text-sm font-bold text-blue-500 whitespace-nowrap">
          {formattedPrice}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <CalendarFold size={12} />
            {formattedDate || "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} />
            {formattedViews} lượt xem
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
          ></span>
          {vietnameseStatus}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/listings/${id}`}
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </Link>
          
          <Link
            href={`/admin/listings/${id}/update`}
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            title="Sửa nội dung"
          >
            <Pen size={17} />
          </Link>

          <button
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Xóa vĩnh viễn"
            onClick={() => setOpenDeleteModal(true)}
          >
            <Trash2 size={18} />
          </button>
        </div>
        {openDeleteModal && (
          <ConfirmDeleteModal
            OnClose={() => setOpenDeleteModal(false)}
            OnSubmit={handleHardDelete}
          />
        )}
        {isLoading && <LoadingOverlay />}
      </td>
    </tr>
  );
}
