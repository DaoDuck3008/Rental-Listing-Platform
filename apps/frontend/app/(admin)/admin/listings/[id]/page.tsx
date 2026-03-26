"use client";

import { getListingDetailAdmin } from "@/services/listing.api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  LayoutList,
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
import Link from "next/link";

export default function AdminListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        if (!id) return;
        // Sử dụng chung API lấy bởi admin (getListingForAdmin trên backend)
        const res = await getListingDetailAdmin(id as string);
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
    <main className="grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link
              href="/admin/listings"
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <LayoutList size={14} />
              Quản lý tin đăng
            </Link>
            <ChevronLeft size={14} className="rotate-180 text-slate-300" />
            <span className="text-slate-900">Chi tiết bài đăng</span>
          </nav>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-slate-900 text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {isEditDraft
                ? "So sánh bản cập nhật"
                : "Thông tin chi tiết bài đăng"}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="text-slate-500 text-base max-w-2xl">
            {isEditDraft
              ? `Đang xem bản chỉnh sửa của bài đăng: ${listing.title}`
              : `Xem chi tiết nội dung bài đăng: ${listing.title}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/listings/${id}/update`}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-amber-500 text-white hover:bg-amber-600 transition-all text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Edit size={18} />
            <span>Chỉnh sửa nội dung</span>
          </Link>
          
          <button
            onClick={() => router.push("/admin/listings")}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-white text-slate-700 hover:bg-slate-50 transition-all text-sm font-bold border border-slate-200 shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${
          isEditDraft ? "lg:grid-cols-2" : ""
        } gap-10`}
      >
        {/* LEFT COLUMN: OLD CONTENT (If EDIT_DRAFT) */}
        {isEditDraft && parent && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                <Eye size={22} className="text-slate-400" />
                Nội dung hiện tại
              </h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                Đang hiển thị
              </span>
            </div>

            {/* Content sections same as moderation */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                      Tiêu đề
                    </label>
                    <p className="text-base font-semibold text-slate-900">
                      {parent.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                      Loại phòng
                    </label>
                    <p className="text-sm font-medium text-slate-700">
                      {parent.listing_type?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                      Giá thuê
                    </label>
                    <p className="text-sm font-bold text-slate-900">
                      {formatVietnamesePrice(parent.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                  Mô tả
                </label>
                <div
                  className="text-sm text-slate-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: parent.description }}
                />
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: NEW CONTENT */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200">
            <h3
              className={`text-xl font-bold flex items-center gap-2.5 ${
                isEditDraft ? "text-blue-600" : "text-slate-800"
              }`}
            >
              <Edit
                size={22}
                className={isEditDraft ? "text-blue-500" : "text-slate-400"}
              />
              {isEditDraft ? "Nội dung cập nhật" : "Nội dung bài đăng"}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Main Info Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-5 ${
                isEditDraft
                  ? "bg-blue-50/40 border-blue-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      isEditDraft ? "text-blue-500" : "text-slate-400"
                    }`}
                  >
                    Tiêu đề
                  </label>
                  <p
                    className={`text-lg font-bold ${
                      isEditDraft && listing.title !== parent?.title
                        ? "text-blue-800"
                        : "text-slate-900"
                    }`}
                  >
                    {listing.title}
                  </p>
                </div>

                {isEditDraft ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ComparisonSection
                      label="Loại phòng"
                      oldVal={parent?.listing_type?.name}
                      newVal={listing.listing_type?.name}
                    />
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
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
                        Loại phòng
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.listing_type?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
                        Giá thuê
                      </label>
                      <p className="text-sm font-bold text-blue-600">
                        {formatVietnamesePrice(listing.price)}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">
                        Diện tích
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        {listing.area} m²
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
                isEditDraft
                  ? "bg-blue-50/40 border-blue-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <label
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isEditDraft ? "text-blue-500" : "text-slate-400"
                }`}
              >
                Mô tả chi tiết
              </label>
              <div
                className="text-sm text-slate-600 prose prose-sm max-w-none prose-slate"
                dangerouslySetInnerHTML={{ __html: listing.description }}
              />
            </div>

            {/* Amenities */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
                isEditDraft
                  ? "bg-blue-50/40 border-blue-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <label
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isEditDraft ? "text-blue-500" : "text-slate-400"
                }`}
              >
                Tiện nghi phòng
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {listing.amenities?.map((am: any) => (
                  <div
                    key={am.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <Icon icon={am.icon} size={14} className="text-slate-400" />
                    {am.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
                isEditDraft
                  ? "bg-blue-50/40 border-blue-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <label
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isEditDraft ? "text-blue-500" : "text-slate-400"
                }`}
              >
                Hình ảnh bài đăng
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {listing.images?.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl bg-cover bg-center border border-slate-200 shadow-sm"
                    style={{ backgroundImage: `url(${img.image_url})` }}
                  />
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={listing.owner?.avatar || "/default-avatar.png"}
                  className="size-14 rounded-full border-2 border-slate-700 object-cover"
                />
                <div>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-0.5">
                    Chủ bài đăng
                  </p>
                  <p className="text-lg font-bold  leading-tight">
                    {listing.owner?.full_name}
                  </p>
                  <p className="text-sm font-medium text-slate-400">
                    {listing.owner?.phone_number || "Chưa cập nhật SĐT"} -{" "}
                    {listing.owner?.email || "Chưa cập nhật email"}
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/users/${listing.owner?.id}`}
                className="px-4 py-2 rounded-lg bg-blue-400 text-white text-xs font-bold hover:bg-blue-500 transition-colors border border-blue-400"
              >
                Xem hồ sơ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top / Bottom back button */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-slate-400 hover:text-slate-900 transition-colors text-sm font-bold flex flex-col items-center gap-2"
        >
          <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
            <ChevronLeft size={20} className="rotate-90" />
          </div>
          Lên đầu trang
        </button>
      </div>
    </main>
  );
}
