"use client";

import ListingBreadcrumb from "@/components/listing/listingBreadCrumb";
import ListingGallery from "@/components/listing/listingGallery";
import { deleteListing, getMyListingDetail } from "@/services/listing.api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bath,
  Bed,
  CalendarDays,
  ChevronDown,
  MapPin,
  TriangleRight,
  Pen,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import NotFoundPage from "@/app/not-found";
import {
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
  formatVietnameseDate,
  handleError,
} from "@/utils";
import LoadingOverlay from "@/components/common/loadingOverlay";
import Icon from "@/components/ui/icon";
import ConfirmDeleteModal from "@/components/listing/confirmDeleteModal";
import ListingViewMapModal from "@/components/listing/listingViewMapModal";

export default function MyListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        if (!id) return;
        const res = await getMyListingDetail(id as string);
        if (res.success) {
          setListing(res.data);
        }
      } catch (error: any) {
        handleError(error, "Không thể tải thông tin bài đăng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const handleDeleteListing = async () => {
    try {
      const result = await deleteListing(id as string);

      if (
        result.status === 200 ||
        result.status === 201 ||
        result.status === 204
      ) {
        toast.success("Xóa bài thành công");
        router.replace("/profile/listing-management");
      }
      return;
    } catch (error: any) {
      handleError(error);
      return;
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!listing) {
    return <NotFoundPage />;
  }

  const images = listing.images?.map((img: any) => img.image_url) || [];
  const statusLabel = getVietnameseStatus(listing.status);
  const statusStyle = getStatusStyle(listing.status);

  return (
    <main className="grow layout-container flex flex-col w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-5">
      {/* Back button */}
      <button
        onClick={() => router.replace("/profile/listing-management")}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 w-fit group"
      >
        <div className="size-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
          <ChevronLeft size={18} />
        </div>
        <span className="text-sm font-bold">Quay lại quản lý tin</span>
      </button>

      {/* Header with Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <ListingBreadcrumb
          province_code={listing.province_code}
          ward_code={listing.ward_code}
          title={listing.title}
        />
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex items-center gap-2 shadow-sm`}
          >
            <span
              className={`size-2 rounded-full ${statusStyle.dot} animate-pulse`}
            ></span>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Hero Gallery */}
      <section>
        <ListingGallery images={images} />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="mt-4 lg:col-span-2 flex flex-col gap-8">
          {/* Title and Location */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em] text-slate-900">
                  {listing.title}
                </h1>
                <p className="text-slate-500 text-base font-normal flex items-center gap-1">
                  <MapPin size={18} className="text-slate-400" />
                  {listing.address}
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                <Bed size={18} className="text-[#92adc9]" />
                <p className="text-sm font-bold">{listing.beds} PN</p>
              </div>
              <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                <Bath size={18} className="text-[#92adc9]" />
                <p className="text-sm font-bold">{listing.baths} WC</p>
              </div>
              <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                <TriangleRight size={18} className="text-[#92adc9]" />
                <p className="text-sm font-bold">{listing.area} m²</p>
              </div>
              <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                <CalendarDays size={18} className="text-[#92adc9]" />
                <p className="text-sm font-bold">Có sẵn ngay</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-slate-900">
              Thông tin mô tả
            </h3>
            <div className="relative">
              <div
                className={`text-slate-600 leading-relaxed prose prose-slate max-w-none transition-all duration-500 overflow-hidden ${
                  isExpanded ? "max-h-1250" : "max-h-50"
                }`}
                dangerouslySetInnerHTML={{ __html: listing.description }}
              ></div>
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary font-bold text-sm self-start hover:underline flex items-center mt-2 group"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
              <ChevronDown
                size={15}
                className={`ml-1 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Amenities */}
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900">
              Tiện nghi chỗ ở
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
              {listing.amenities?.map((amenity: any) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <Icon icon={amenity.icon} className="text-[#92adc9]" />
                  <span className="text-sm font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900">
              Vị trí bài đăng
            </h3>
            <div
              onClick={() => setIsMapModalOpen(true)}
              className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden group bg-slate-100 cursor-pointer border border-slate-200"
            >
              <img
                alt="Vị trí trên bản đồ"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={
                  listing.latitude && listing.longitude
                    ? `https://maps.googleapis.com/maps/api/staticmap?center=${listing.latitude},${listing.longitude}&zoom=16&size=1200x600&markers=color:red%7C${listing.latitude},${listing.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCeAVSSsPmznwMIv5cR4lgMGVP4Z_UB8rLGSXonecm9SD-7lHW21mu1vLPCUiWYSCURucpYJTyaeofJguU0XlyA9e3WJVZ3ZMtNhnEYRble5c0NKt2JXhezQtUNXZAbzHRSMD6TfLHAk1Aj7WRw29eA4jTzZWiWw3Xcv9_kSGB91cNdectrEl_PjXkJ4MBA89qA2lt8jvHfhzH7eE3UlqgXyvKjROWg10wqlKc7M92rbMnVdyBvg2riDZd-g4Ku7DhsJcdomZlYfEMR"
                }
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Xem bản đồ chi tiết
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500">Địa chỉ: {listing.address}</p>
          </div>
        </div>

        {/* Admin Sidebar */}
        <div className="lg:col-span-1 relative mt-4">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 flex flex-col gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Giá thuê hiện tại</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary">
                    {formatVietnamesePrice(listing.price)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push(`/listing-update/${id}`)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Pen size={18} />
                  Chỉnh sửa tin đăng
                </button>
                <button
                  onClick={() => setOpenDeleteModal(true)}
                  className="w-full bg-transparent border border-red-200 text-red-600 hover:bg-red-50 font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Trash2 size={18} />
                  Xóa bài viết
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-2">
                  Thống kê tin đăng:
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Lượt xem:</span>
                  <span className="font-bold text-slate-900">
                    {listing.views || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-slate-600">Ngày tạo:</span>
                  <span className="font-bold text-slate-900">
                    {formatVietnameseDate(listing.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openDeleteModal && (
        <ConfirmDeleteModal
          OnClose={() => setOpenDeleteModal(false)}
          OnSubmit={() => handleDeleteListing()}
        />
      )}

      {/* Map Modal */}
      {listing.latitude && listing.longitude && (
        <ListingViewMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          location={{ lat: listing.latitude, lng: listing.longitude }}
          address={listing.address}
        />
      )}
    </main>
  );
}
