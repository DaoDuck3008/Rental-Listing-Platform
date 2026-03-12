import {
  CalendarFold,
  Eye,
  EyeOff,
  MapPin,
  Pen,
  Trash2,
  RefreshCw,
  SquarePen,
} from "lucide-react";
import {
  formatVietnameseDate,
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
  formatViews,
  handleError,
} from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  deleteListing,
  hideListing,
  renewListing,
  showListing,
} from "@/services/listing.api";
import ConfirmDeleteModal from "./confirmDeleteModal";
import Link from "next/link";
import LoadingOverlay from "../common/loadingOverlay";

interface ListingTableBodyProps {
  id: string;
  img_url?: string;
  title: string;
  address: string;
  price: number;
  createdAt?: string;
  views: string | number;
  status?: string;
  onRefresh?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => Promise<void>;
}

export default function ListingTableBody({
  id,
  img_url,
  title,
  address,
  price,
  createdAt,
  views,
  status,
  onRefresh,
  isFavorite = false,
  onToggleFavorite,
}: ListingTableBodyProps) {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleHideListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const result = await hideListing(listingId as string);
      setIsLoading(false);

      if (
        result &&
        (result.status === 200 ||
          result.status === 201 ||
          result.status === 204)
      ) {
        toast.success(result.data.message);
        if (onRefresh) onRefresh();
        else router.refresh();
        return;
      }
    } catch (error: any) {
      handleError(error, "Đã có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };

  const handleShowLisiting = async (listingId: string) => {
    try {
      setIsLoading(true);
      const result = await showListing(listingId as string);
      setIsLoading(false);

      if (
        result &&
        (result.status === 200 ||
          result.status === 201 ||
          result.status === 204)
      ) {
        toast.success(result.data.message);
        if (onRefresh) onRefresh();
        else router.refresh();
        return;
      }
    } catch (error: any) {
      handleError(error, "Đã có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };

  const handleRenewListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const result = await renewListing(listingId);
      setIsLoading(false);

      if (
        result &&
        (result.status === 200 ||
          result.status === 201 ||
          result.status === 204)
      ) {
        toast.success(result.data.message);
        if (onRefresh) onRefresh();
        else router.refresh();
        return;
      }
    } catch (error: any) {
      handleError(error, "Đã có lỗi xảy ra. Vui lòng thử lại sau");
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const result = await deleteListing(listingId as string);

      if (
        result.status === 200 ||
        result.status === 201 ||
        result.status === 204
      ) {
        toast.success("Xóa bài thành công");
        if (onRefresh) onRefresh();
        else router.replace("/profile");
      }
      return;
    } catch (error: any) {
      handleError(error);
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
            />
          </div>
          <Link
            href={isFavorite ? `/listing-detail/${id}` : `/profile/my-listing-detail/${id}`}
            className="flex flex-col gap-1 cursor-pointer"
          >
            <p className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-500 transition-colors">
              {title}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                <MapPin size={12} />
              </span>
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
            <span className="material-symbols-outlined text-[14px]">
              <CalendarFold size={12} />
            </span>
            {formattedDate || "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              <Eye size={12} />
            </span>
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
          {isFavorite ? (
            <button
              className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Bỏ yêu thích"
              onClick={() => onToggleFavorite?.()}
            >
              <Trash2 size={15} />
            </button>
          ) : (
            <>
              {status === "EXPIRED" ? (
                <button
                  className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                  title="Làm mới tin"
                  onClick={() => handleRenewListing(id)}
                >
                  <RefreshCw size={15} />
                </button>
              ) : (
                <>
                  {status !== "DRAFT" &&
                    status !== "PENDING" &&
                    status !== "EDIT-DRAFT" &&
                    status !== "HIDDEN" && (
                      <button
                        className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Ẩn tin"
                        onClick={() => handleHideListing(id)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          <EyeOff size={15} />
                        </span>
                      </button>
                    )}

                  {status === "HIDDEN" && (
                    <button
                      className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      title="Hiển thị tin"
                      onClick={() => handleShowLisiting(id)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        <Eye size={15} />
                      </span>
                    </button>
                  )}
                </>
              )}

              {status !== "PENDING" && status !== "DRAFT" && (
                <Link
                  className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Chỉnh sửa"
                  href={`/listing-update/${id}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    <Pen size={15} />
                  </span>
                </Link>
              )}
              {status === "DRAFT" && (
                <Link
                  className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Hoàn thiện bài đăng"
                  href={`/listing-update-draft/${id}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    <SquarePen size={15} />
                  </span>
                </Link>
              )}

              <button
                className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Xóa tin"
                onClick={() => setOpenDeleteModal(true)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  <Trash2 size={15} />
                </span>
              </button>
            </>
          )}
        </div>
        {openDeleteModal && (
          <ConfirmDeleteModal
            OnClose={() => setOpenDeleteModal(false)}
            OnSubmit={() => handleDeleteListing(id)}
          />
        )}
        {isLoading && <LoadingOverlay />}
      </td>
    </tr>
  );
}
