"use client";

import ListingBreadcrumb from "@/components/listing/listingBreadCrumb";
import ListingGallery from "@/components/listing/listingGallery";
import RelatedListings from "@/components/listing/relatedListings";
import { getListingDetail } from "@/services/listing.api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bath,
  Bed,
  CalendarDays,
  ChevronDown,
  Heart,
  Mail,
  MapPin,
  Share2,
  Shield,
  TriangleRight,
} from "lucide-react";
import { toast } from "react-toastify";
import NotFoundPage from "@/app/not-found";
import { formatVietnamesePrice } from "@/utils";
import ListingComments from "@/components/listing/listingComments";
import Avatar from "@/components/common/avatar";
import LoadingOverlay from "@/components/common/loadingOverlay";
import Icon from "@/components/ui/icon";
import BackButton from "@/components/common/backButton";
import ListingViewMapModal from "@/components/listing/listingViewMapModal";
import { useAuthStore } from "@/store/auth.store";
import NearbyDestinations from "@/components/listing/nearbyDestinations";
import { useInView } from "react-intersection-observer";
import { createChat } from "@/services/chat.api";
import { useChatStore } from "@/store/chat.store";
import { useRouter } from "next/navigation";

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  const { openChat } = useChatStore();
  const router = useRouter();

  const { ref: nearbyRef, inView: nearbyInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const { ref: commentsRef, inView: commentsInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const { ref: relatedRef, inView: relatedInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        if (!id) return;
        const res = await getListingDetail(id as string);
        if (res.success) {
          setListing(res.data);
        }
      } catch (error: any) {
        const res = error.response.data;
        if (res.error === "NOT_FOUND") {
          return;
        }

        toast.error("Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const handleContactHost = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để liên hệ với chủ nhà");
      router.push("/login");
      return;
    }

    if (user.id === listing.owner_id) {
      toast.warning("Bạn không thể liên hệ với chính mình");
      return;
    }

    try {
      setIsContacting(true);
      const res = await createChat(listing.owner_id);
      if (res.success) {
        openChat(res.data);
      }
    } catch (error) {
      toast.error("Không thể tạo cuộc hội thoại");
    } finally {
      setIsContacting(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!listing) {
    return <NotFoundPage />;
  }

  const images = listing.images?.map((img: any) => img.image_url) || [];

  return (
    <main className="grow layout-container flex flex-col w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-5">
      {/* Back button */}
      <BackButton />

      {/* Breadcrumb */}
      <ListingBreadcrumb
        province_code={listing.province_code}
        ward_code={listing.ward_code}
        title={listing.title}
      />

      {/* Hero Gallery */}
      <section className="mt-6">
        <ListingGallery images={images} />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="mt-4 lg:col-span-2 flex flex-col gap-8">
          {/* Title and Location */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-8">
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
                  <button className="hidden sm:flex shrink-0 items-center justify-center rounded-lg h-9 px-3 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                    <BadgeCheck size={16} className="mr-1" />
                    Đã xác thực
                  </button>
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
            </div>
          </div>

          {/* Description */}
          <div className="h-px bg-slate-200 w-full mt-6"></div>
          <div className="flex flex-col gap-3 mt-6">
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
          <div className="h-px bg-slate-200 w-full mt-6"></div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 mt-6">
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
            {listing.amenities?.length > 6 && (
              <button className="mt-2 py-2 px-6 border border-slate-300 rounded-lg text-sm font-bold self-start hover:bg-slate-100 transition-colors">
                Xem tất cả {listing.amenities.length} tiện nghi
              </button>
            )}
          </div>

          {/* Location */}
          <div className="h-px bg-slate-200 w-full mt-6"></div>
          <div className="flex flex-col gap-4 mt-6">
            <h3 className="text-xl font-bold text-slate-900">Vị trí của bạn</h3>
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

          {/* Nearby Destinations */}
          <div ref={nearbyRef}>
            {nearbyInView ? (
              <NearbyDestinations listingId={listing.id} />
            ) : (
              <div className="h-40" />
            )}
          </div>
        </div>

        {/* LandLord Profile */}
        <div className="lg:col-span-1 relative mt-6">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 flex flex-col gap-6">
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm text-slate-500">Giá thuê mỗi tháng</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                      {formatVietnamesePrice(
                        listing.price?.toLocaleString("vi-VN")
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="size-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="size-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:text-primary transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar
                  avatar={listing.owner.avatar}
                  name={listing.owner.full_name}
                />
                <div>
                  <p className="text-slate-900 font-bold">
                    {listing.owner?.full_name || "Chủ nhà"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Chủ nhà xác thực • 5.0 ★
                  </p>
                  {listing.show_phone_number && (
                    <p className="text-xs text-primary font-bold mt-1">
                      SĐT: {listing.owner?.phone_number || "Chưa cập nhật"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleContactHost}
                  disabled={isContacting}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Mail size={20} />
                  {isContacting ? "Đang kết nối..." : "Liên hệ chủ nhà"}
                </button>
                <button className="w-full bg-transparent border border-primary text-primary hover:bg-primary/10 font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-all">
                  <CalendarDays size={20} />
                  Yêu cầu xem nhà
                </button>
              </div>
              <p className="text-center text-xs text-slate-400">
                Thường phản hồi trong 1 giờ
              </p>
            </div>
            <div className="bg-slate-100 rounded-lg p-4 flex gap-3 items-start border border-slate-200">
              <Shield size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  An toàn là trên hết
                </p>
                <p className="text-xs text-slate-600">
                  Không bao giờ chuyển tiền trước khi xem nhà. Báo cáo tin đăng
                  đáng ngờ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Listings */}
      <div ref={relatedRef}>
        {relatedInView ? (
          <RelatedListings listingId={listing.id} />
        ) : (
          <div className="h-40" />
        )}
      </div>

      {/* Comments */}
      <div ref={commentsRef}>
        {commentsInView ? (
          <ListingComments listingId={listing.id} user={user} />
        ) : (
          <div className="h-40" />
        )}
      </div>

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
