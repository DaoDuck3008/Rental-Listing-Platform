"use client";

import {
  X,
  MapPin,
  Bed,
  Bath,
  TriangleRight,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatVietnamesePrice } from "@/utils";
import ListingGallery from "./listingGallery";
import Icon from "../ui/icon";

interface ListingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    address: string;
    price: number;
    area: number;
    beds: number;
    bathrooms: number;
    description: string;
    amenities: string[]; // IDs
  };
  allAmenities: any[];
  images: (File | string)[];
}

export default function ListingPreviewModal({
  isOpen,
  onClose,
  data,
  allAmenities,
  images,
}: ListingPreviewModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const urls = images.map((img) => {
        if (typeof img === "string") return img;
        return URL.createObjectURL(img);
      });
      setImageUrls(urls);

      return () => {
        document.body.style.overflow = "auto";
        urls.forEach((url) => {
            if (!images.includes(url)) URL.revokeObjectURL(url);
        });
      };
    }
  }, [isOpen, images]);

  if (!isOpen) return null;

  const selectedAmenities = allAmenities.filter((a) =>
    data.amenities.includes(a.id)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Bản xem trước
            </div>
            <span className="text-slate-500 text-sm hidden md:inline italic">
              Đây là cách tin đăng của bạn hiển thị với người dùng
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Side of My-Listing-Detail */}
        <div className="grow overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-5xl mx-auto px-6 lg:px-10 py-8">
        {/* Gallery */}
        <section className="mb-8">
            <ListingGallery images={imageUrls.length > 0 ? imageUrls : ["/NoImage.jpg"]} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Title and Location */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em] text-slate-900">
                  {data.title || "Tiêu đề chưa nhập"}
                </h1>
                <p className="text-slate-500 text-base font-normal flex items-center gap-1">
                  <MapPin size={18} className="text-slate-400" />
                  {data.address || "Địa chỉ chưa nhập"}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                  <Bed size={18} className="text-[#92adc9]" />
                  <p className="text-sm font-bold">{data.beds} PN</p>
                </div>
                <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                  <Bath size={18} className="text-[#92adc9]" />
                  <p className="text-sm font-bold">{data.bathrooms} WC</p>
                </div>
                <div className="flex h-10 items-center gap-x-2 rounded-lg bg-slate-100 px-4 text-slate-700">
                  <TriangleRight size={18} className="text-[#92adc9]" />
                  <p className="text-sm font-bold">{data.area} m²</p>
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
                    isExpanded ? "max-h-full" : "max-h-50"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: data.description || "Chưa có mô tả",
                  }}
                ></div>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
                )}
              </div>
              <button
                type="button"
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
              {selectedAmenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                  {selectedAmenities.map((amenity: any) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <Icon icon={amenity.icon} className="text-[#92adc9]" />
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Chưa chọn tiện ích nào
                </p>
              )}
            </div>

            {/* Location */}
            <div className="h-px bg-slate-200 w-full"></div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-slate-900">
                Vị trí bài đăng
              </h3>
              <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden group bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                  style={{ backgroundImage: "url('/MapBackground.png')" }}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 border border-white/20">
                    <MapPin size={20} className="text-primary" />
                    Vị trí tương đối
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Địa chỉ: {data.address || "Chưa nhập địa chỉ"}
              </p>
            </div>
          </div>

          {/* Price Card */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 flex flex-col gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Giá thuê đề xuất</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                      {formatVietnamesePrice(data.price)}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  * Đây là bản xem trước giao diện. Vui lòng đóng bản xem trước để tiếp tục hoàn thiện hoặc đăng tin.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                    Đóng xem trước
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
