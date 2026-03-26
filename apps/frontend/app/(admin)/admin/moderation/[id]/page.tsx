"use client";

import ListingBreadcrumb from "@/components/listing/listingBreadCrumb";
import ListingGallery from "@/components/listing/listingGallery";
import {
  getListingForModerationDetail,
  approveListing,
  rejectListing,
  approveEditDraft,
  rejectEditDraft,
} from "@/services/listing.api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "react-toastify";
import NotFoundPage from "@/app/not-found";
import {
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
} from "@/utils";
import LoadingOverlay from "@/components/common/loadingOverlay";
import Icon from "@/components/ui/icon";
import ReviewActionModal from "@/components/admin/ReviewActionModal";

export default function AdminListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modalType, setModalType] = useState<"APPROVE" | "REJECT" | null>(null);

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        if (!id) return;
        const res = await getListingForModerationDetail(id as string);
        if (res.success) {
          setListing(res.data);
        }
      } catch (error: any) {
        console.error("Error fetching listing detail:", error);
        toast.error("Không thể tải thông tin bài đăng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const handleReviewAction = async (reason?: string) => {
    if (!modalType || !listing) return;

    setIsActionLoading(true);
    try {
      const isEditDraft = listing.status === "EDIT_DRAFT";
      let res;

      if (modalType === "APPROVE") {
        res = isEditDraft
          ? await approveEditDraft(id as string)
          : await approveListing(id as string);

        if (res.status === 200 || res.status === 201) {
          toast.success("Đã duyệt bài đăng thành công");
          router.replace("/admin/moderation");
        }
      } else {
        res = isEditDraft
          ? await rejectEditDraft(id as string, reason)
          : await rejectListing(id as string, reason);

        if (res.status === 200 || res.status === 201) {
          toast.success("Đã từ chối bài đăng thành công");
          router.replace("/admin/moderation");
        }
      }
    } catch (error: any) {
      const res = error.response.data;
      if (!res) {
        toast.error(res.message || "Đã có lỗi xảy ra");
        console.error(error);
        return;
      }
      toast.error(res.message || "Lỗi không xác định");
      return;
    } finally {
      setIsActionLoading(false);
      setModalType(null);
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!listing) {
    return <NotFoundPage />;
  }

  const isEditDraft = listing.status === "EDIT_DRAFT";
  const parent = listing.parentListing;

  const statusLabel = getVietnameseStatus(listing.status);
  const statusStyle = getStatusStyle(listing.status);

  const ComparisonSection = ({ label, oldVal, newVal, type = "text" }: any) => {
    const isChanged = oldVal !== newVal;

    return (
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {isChanged && oldVal !== undefined && (
            <span className="line-through text-slate-400 text-sm">
              {type === "price"
                ? formatVietnamesePrice(oldVal)
                : `${oldVal}${type === "area" ? " m²" : ""}`}
            </span>
          )}
          <span
            className={`text-sm font-bold p-1 rounded ${
              isChanged ? "bg-blue-100 text-blue-700" : "text-slate-700"
            }`}
          >
            {type === "price"
              ? formatVietnamesePrice(newVal)
              : `${newVal}${type === "area" ? " m²" : ""}`}
          </span>
          {isChanged &&
            type === "price" &&
            (Number(newVal) > Number(oldVal) ? (
              <TrendingUp size={14} className="text-blue-600" />
            ) : (
              <TrendingDown size={14} className="text-blue-600" />
            ))}
        </div>
      </div>
    );
  };

  return (
    <main className="grow flex flex-col w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-5 pb-32">
      {/* Back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Quản lý tin đăng</span>
            <ChevronLeft size={14} className="rotate-180" />
            <span>Phê duyệt</span>
          </div>
          <h1 className="text-slate-900 text-2xl md:text-3xl font-black leading-tight">
            {isEditDraft
              ? "So sánh nội dung cập nhật"
              : "Chi tiết bài đăng phê duyệt"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isEditDraft
              ? `So khớp bản cũ và bản chỉnh sửa của: ${listing.title}`
              : `Bài đăng mới: ${listing.title}`}
          </p>
        </div>
        <button
          onClick={() => router.replace("/admin/moderation")}
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-bold border border-slate-200 w-fit"
        >
          <ChevronLeft size={18} />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      <div
        className={`grid grid-cols-1 ${
          isEditDraft ? "md:grid-cols-2" : ""
        } gap-8`}
      >
        {/* LEFT COLUMN: OLD CONTENT (If EDIT_DRAFT) */}
        {isEditDraft && parent && (
          <div className="flex flex-col gap-6 opacity-80 border-r border-slate-200 pr-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Eye size={20} className="text-slate-400" />
                Nội dung đang hiển thị
              </h3>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                Đang hoạt động
              </span>
            </div>

            {/* Header Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Tiêu đề
                </label>
                <p className="text-sm font-medium text-slate-800">
                  {parent.title}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Loại phòng
                </label>
                <p className="text-sm font-medium text-slate-800">
                  {parent.listing_type?.name || "Chưa xác định"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Địa chỉ
                </label>
                <p className="text-sm font-medium text-slate-800">
                  {parent.address}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Giá thuê
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {formatVietnamesePrice(parent.price)}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Diện tích
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {parent.area} m²
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Phòng ngủ
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {parent.bedrooms} PN
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Phòng tắm
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {parent.bathrooms} WC
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Sức chứa
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {parent.capacity} người
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Mô tả chi tiết
              </label>
              <div
                className="text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar prose prose-sm prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: parent.description }}
              />
            </div>

            {/* Amenities */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Tiện nghi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {parent.amenities?.map((am: any) => (
                  <div
                    key={am.id}
                    className="flex items-center gap-2 text-slate-600 text-xs"
                  >
                    <Icon icon={am.icon} size={14} className="text-slate-400" />
                    {am.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Hình ảnh ({parent.images?.length || 0})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {parent.images?.slice(0, 6).map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg bg-cover bg-center border border-slate-200"
                    style={{ backgroundImage: `url(${img.image_url})` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: NEW CONTENT (OR MAIN CONTENT IF NOT DRAFT) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b pb-2 border-slate-200">
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${
                isEditDraft ? "text-primary" : "text-slate-900"
              }`}
            >
              <Edit
                size={20}
                className={isEditDraft ? "text-primary" : "text-slate-400"}
              />
              {isEditDraft
                ? "Nội dung cập nhật (Bản nháp)"
                : "Nội dung bài đăng"}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-bold rounded ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Header Info (Comparison) */}
          <div
            className={`p-5 rounded-xl border shadow-sm flex flex-col gap-4 ${
              isEditDraft
                ? "bg-blue-50/30 border-blue-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isEditDraft ? "text-blue-400" : "text-slate-400"
                  }`}
                >
                  Tiêu đề
                </label>
                <p
                  className={`text-sm font-bold ${
                    isEditDraft && listing.title !== parent?.title
                      ? "text-blue-700 bg-blue-100/50 p-1 rounded"
                      : "text-slate-900"
                  }`}
                >
                  {listing.title}
                </p>
              </div>

              {isEditDraft ? (
                <>
                  <ComparisonSection
                    label="Loại phòng"
                    oldVal={parent?.listing_type?.name}
                    newVal={listing.listing_type?.name}
                  />
                  <ComparisonSection
                    label="Địa chỉ"
                    oldVal={parent?.address}
                    newVal={listing.address}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Loại phòng
                    </label>
                    <p className="text-sm font-bold text-slate-900">
                      {listing.listing_type?.name || "Chưa xác định"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Địa chỉ
                    </label>
                    <p className="text-sm font-bold text-slate-900">
                      {listing.address}
                    </p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                {isEditDraft ? (
                  <>
                    <ComparisonSection
                      label="Giá thuê"
                      oldVal={parent?.price}
                      newVal={listing.price}
                      type="price"
                    />
                    <ComparisonSection
                      label="Diện tích"
                      oldVal={parent?.area}
                      newVal={listing.area}
                      type="area"
                    />
                    <ComparisonSection
                      label="Số phòng ngủ"
                      oldVal={parent?.bedrooms}
                      newVal={listing.bedrooms}
                    />
                    <ComparisonSection
                      label="Số phòng tắm"
                      oldVal={parent?.bathrooms}
                      newVal={listing.bathrooms}
                    />
                    <ComparisonSection
                      label="Sức chứa"
                      oldVal={parent?.capacity}
                      newVal={listing.capacity}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Giá thuê
                      </label>
                      <p className="text-sm font-bold text-primary">
                        {formatVietnamesePrice(listing.price)}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Diện tích
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.area} m²
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Phòng ngủ
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.bedrooms} PN
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Phòng tắm
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.bathrooms} WC
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Sức chứa
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.capacity} người
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className={`p-5 rounded-xl border shadow-sm flex flex-col gap-2 ${
              isEditDraft
                ? "bg-blue-50/30 border-blue-200"
                : "bg-white border-slate-200"
            }`}
          >
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isEditDraft ? "text-blue-400" : "text-slate-400"
              }`}
            >
              Mô tả chi tiết
            </label>
            <div
              className={`text-sm leading-relaxed max-h-80 overflow-y-auto custom-scrollbar prose prose-sm prose-slate max-w-none ${
                isEditDraft && listing.description !== parent?.description
                  ? "bg-blue-100/30 p-3 rounded border-l-4 border-blue-400"
                  : ""
              }`}
              dangerouslySetInnerHTML={{ __html: listing.description }}
            />
          </div>

          {/* Amenities Comparison */}
          <div
            className={`p-5 rounded-xl border shadow-sm flex flex-col gap-3 ${
              isEditDraft
                ? "bg-blue-50/30 border-blue-200"
                : "bg-white border-slate-200"
            }`}
          >
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isEditDraft ? "text-blue-400" : "text-slate-400"
              }`}
            >
              Tiện nghi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listing.amenities?.map((am: any) => {
                const isNew =
                  isEditDraft &&
                  !parent?.amenities?.some((pam: any) => pam.id === am.id);
                return (
                  <div
                    key={am.id}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      isNew
                        ? "text-blue-700 bg-blue-100 px-2 py-1 rounded"
                        : "text-slate-700"
                    }`}
                  >
                    <Icon
                      icon={am.icon}
                      size={14}
                      className={isNew ? "text-blue-500" : "text-slate-400"}
                    />
                    {am.name}
                    {isNew && (
                      <span className="text-[8px] font-black uppercase ml-auto">
                        Mới
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div
            className={`p-5 rounded-xl border shadow-sm flex flex-col gap-3 ${
              isEditDraft
                ? "bg-blue-50/30 border-blue-200"
                : "bg-white border-slate-200"
            }`}
          >
            <label
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isEditDraft ? "text-blue-400" : "text-slate-400"
              }`}
            >
              Hình ảnh ({listing.images?.length || 0})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {listing.images?.map((img: any, idx: number) => {
                const isOld =
                  isEditDraft &&
                  parent?.images?.some(
                    (pimg: any) => pimg.public_id === img.public_id
                  );
                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg bg-cover bg-center border relative ${
                      isEditDraft && !isOld
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-slate-200"
                    }`}
                    style={{ backgroundImage: `url(${img.image_url})` }}
                  >
                    {isEditDraft && !isOld && (
                      <div className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                        MỚI
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!isEditDraft && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <img
                src={listing.owner?.avatar || "/default-avatar.png"}
                className="size-12 rounded-full border border-slate-300 object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {listing.owner?.full_name}
                </p>
                <p className="text-xs text-slate-500">
                  {listing.owner?.phone_number || "Chưa có SĐT"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STICKY FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)] py-4 px-6 z-40">
        <div className="max-w-360 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={listing.owner?.avatar || "/default-avatar.png"}
              className="size-10 rounded-full border border-slate-200 hidden md:block"
            />
            <div className="flex flex-col">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Người đăng bài
              </p>
              <p className="text-sm font-bold text-slate-900">
                {listing.owner?.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setModalType("REJECT")}
              disabled={isActionLoading}
              className="flex-1 md:flex-none h-12 px-8 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <XCircle size={18} />
              Từ chối {isEditDraft ? "cập nhật" : "duyệt bài"}
            </button>
            <button
              onClick={() => setModalType("APPROVE")}
              disabled={isActionLoading}
              className="flex-1 md:flex-none h-12 px-10 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              Duyệt {isEditDraft ? "thay đổi" : "bài đăng"}
            </button>
          </div>
        </div>
      </div>

      {modalType && (
        <ReviewActionModal
          type={modalType}
          isLoading={isActionLoading}
          onClose={() => setModalType(null)}
          onSubmit={handleReviewAction}
        />
      )}
    </main>
  );
}
