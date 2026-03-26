"use client";

import DescriptionEditor from "@/components/common/descriptionEditor";
import UploadListingImage from "@/components/listing/uploadListingImage";
import { useAmenities } from "@/hooks/useAmenities";
import { useProvinces, useWardsByProvince } from "@/hooks/useProvinces";
import {
  ChevronDown,
  Eye,
  Image,
  Info,
  List,
  MapPin,
  Sparkles,
  icons,
  LayoutList,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "react-toastify";
import createListingProps from "@/types/listing.type";
import { CreateListingValidate } from "@/schema/Listing.validator";
import { useListingTypes } from "@/hooks/useListing";
import {
  getListingDetailAdmin,
  updateListingAdmin,
} from "@/services/listing.api";
import LoadingOverlay from "@/components/common/loadingOverlay";
import MapPickerModal from "@/components/listing/mapPickerModal";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import Link from "next/link";

const libraries: "places"[] = ["places"];

export default function AdminUpdateListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<createListingProps>({
    title: "",
    listing_type_code: "APARTMENT",
    capacity: 1,
    price: 0,
    area: 0,
    beds: 1,
    bathrooms: 1,
    province_code: null,
    ward_code: null,
    address: "",
    longitude: null,
    latitude: null,
    amenities: [],
    description: "",
    showPhoneNumber: true,
  });

  const [images, setImages] = useState<File[] | null>(null);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const { provinces, isLoading: provinceIsLoading } = useProvinces();
  const { wards, isLoading: wardIsLoading } = useWardsByProvince(
    form.province_code
  );
  const { amenities, isLoading: amenitiesIsLoading } = useAmenities();
  const { listingTypes, isLoading: listingTypesIsLoading } = useListingTypes();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const res = await getListingDetailAdmin(id as string);
        if (res.success) {
          const data = res.data;
          const formData: createListingProps = {
            title: data.title || "",
            listing_type_code: data.listing_type?.code || "APARTMENT",
            capacity: data.capacity || 1,
            price: data.price || 0,
            area: data.area || 0,
            beds: data.bedrooms || 1,
            bathrooms: data.bathrooms || 1,
            province_code: data.province_code || null,
            ward_code: data.ward_code || null,
            address: data.address || "",
            longitude: data.longitude || null,
            latitude: data.latitude || null,
            amenities: data.amenities?.map((a: any) => a.id) || [],
            description: data.description || "",
            showPhoneNumber: data.show_phone_number ?? true,
          };
          setForm(formData);
          setInitialImageUrls(
            data.images?.map((img: any) => img.image_url) || []
          );
        }
      } catch (error: any) {
        console.error("Error fetching listing:", error);
        toast.error("Không thể tải thông tin bài đăng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "address" ? { latitude: null, longitude: null } : {}),
    }));
  };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setForm((prev) => ({
      ...prev,
      address: place.formatted_address || prev.address,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      province_code: value ? Number(value) : null,
      ward_code: null,
    }));
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      ward_code: value ? Number(value) : null,
    }));
  };

  const handleIncreaseNumber = (name: "beds" | "bathrooms") => {
    setForm((prev) => ({
      ...prev,
      [name]: Number(form[name]) + 1,
    }));
  };

  const handleDecreaseNumber = (name: "beds" | "bathrooms") => {
    if (Number(form[name]) <= 0) return;
    setForm((prev) => ({
      ...prev,
      [name]: Number(form[name]) - 1,
    }));
  };

  const handleAmenityToggle = (id: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== id)
          : [...prev.amenities, id],
      };
    });
  };

  const handleShowPhoneNumberToggle = () => {
    setForm((prev) => ({
      ...prev,
      showPhoneNumber: !prev.showPhoneNumber,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!CreateListingValidate({ form, images, isUpdate: true })) return;

      setIsSubmitting(true);

      const res = await updateListingAdmin(
        id as string,
        form,
        images,
        coverImageIndex
      );

      setIsSubmitting(false);
      if (res && (res.status === 200 || res.status === 201)) {
        toast.success("Admin cập nhật bài đăng thành công.");
        router.push("/admin/listings");
      }
    } catch (error: any) {
      setIsSubmitting(false);
      const res = error.response?.data;
      if (!res) {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        return;
      }
      toast.error(res.message || "Đã có lỗi xảy ra!");
    }
  };

  if (isLoading) return <LoadingOverlay message="Đang tải dữ liệu..." />;

  return (
    <>
      <main className="grow py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
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
              <span className="text-slate-900">Cập nhật tin đăng</span>
            </nav>

            <h1 className="text-slate-900 text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mt-1">
              Chỉnh sửa bài đăng (Admin)
            </h1>
            <p className="text-slate-500 text-base max-w-2xl">
              Chế độ quản trị viên: Bạn có quyền thay đổi tất cả các thông tin
              của bài đăng mà không cần phê duyệt lại.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/listings")}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-white text-slate-700 hover:bg-slate-50 transition-all text-sm font-bold border border-slate-200 shadow-sm"
          >
            <ChevronLeft size={20} />
            <span>Hủy thay đổi</span>
          </button>
        </div>

        {/* LISTING FORM */}
        <div className="flex flex-col gap-8 max-w-5xl">
          {/* SECTION 1: BASIC INFORMATION */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                <Info size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                1. Thông tin cơ bản
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tiêu đề bài đăng <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Ví dụ: Phòng trọ giá rẻ, khép kín, gần ĐH Bách Khoa..."
                  type="text"
                  value={form.title}
                  name="title"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Loại hình cho thuê <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="listing_type_code"
                    value={form.listing_type_code}
                    onChange={handleChange}
                    className="w-full h-12 px-4 appearance-none rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="">Chọn loại hình</option>
                    {listingTypes &&
                      listingTypes.map((lt: any) => (
                        <option key={lt.code} value={lt.code}>
                          {lt.name}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Sức chứa (người)
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Nhập số người tối đa"
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Giá thuê (VNĐ/tháng) <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold text-blue-600"
                  placeholder="Nhập giá thuê"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Diện tích (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Nhập diện tích"
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Số phòng ngủ
                </label>
                <div className="flex items-center h-12 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    className="px-4 h-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 font-bold text-xl"
                    type="button"
                    onClick={() => handleDecreaseNumber("beds")}
                  >
                    -
                  </button>
                  <input
                    className="w-full h-full text-center border-none focus:ring-0 p-0 text-slate-900 font-bold"
                    type="number"
                    value={form.beds}
                    name="beds"
                    onChange={handleChange}
                  />
                  <button
                    className="px-4 h-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 font-bold text-xl"
                    type="button"
                    onClick={() => handleIncreaseNumber("beds")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Số phòng vệ sinh
                </label>
                <div className="flex items-center h-12 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    className="px-4 h-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 font-bold text-xl"
                    type="button"
                    onClick={() => handleDecreaseNumber("bathrooms")}
                  >
                    -
                  </button>
                  <input
                    className="w-full h-full text-center border-none focus:ring-0 p-0 text-slate-900 font-bold"
                    type="number"
                    value={form.bathrooms}
                    name="bathrooms"
                    onChange={handleChange}
                  />
                  <button
                    className="px-4 h-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 font-bold text-xl"
                    type="button"
                    onClick={() => handleIncreaseNumber("bathrooms")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ADDRESS AND LOCATION */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                2. Địa chỉ & Vị trí
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    onChange={handleProvinceChange}
                    name="province_code"
                    value={form.province_code || ""}
                    className="w-full h-12 px-4 appearance-none rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces?.map((p: any) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    onChange={handleWardChange}
                    name="ward_code"
                    value={form.ward_code || ""}
                    disabled={!form.province_code}
                    className="w-full h-12 px-4 appearance-none rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards?.map((w: any) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                {isLoaded && (
                  <Autocomplete
                    onLoad={(autocomplete) =>
                      (autocompleteRef.current = autocomplete)
                    }
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                      componentRestrictions: { country: "vn" },
                      fields: ["geometry", "formatted_address"],
                    }}
                  >
                    <input
                      value={form.address || ""}
                      name="address"
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="Số nhà, tên đường, khu dân cư..."
                      type="text"
                    />
                  </Autocomplete>
                )}
              </div>

              <div
                onClick={() => setIsMapModalOpen(true)}
                className="md:col-span-2 rounded-2xl overflow-hidden h-64 relative bg-slate-100 border border-slate-200 group cursor-pointer transition-all hover:ring-2 ring-blue-500/20"
              >
                <img
                  alt="Vị trí trên bản đồ"
                  className="w-full h-full object-cover transition-all group-hover:scale-105"
                  src={
                    form.latitude && form.longitude
                      ? `https://maps.googleapis.com/maps/api/staticmap?center=${form.latitude},${form.longitude}&zoom=16&size=800x400&markers=color:red%7C${form.latitude},${form.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                      : "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                  <div className="bg-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-blue-600 font-bold transform transition-all group-hover:scale-110">
                    <MapPin size={18} />
                    <span>Thay đổi vị trí trên bản đồ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: IMAGES */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Image size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                3. Hình ảnh bài đăng
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <strong>Lưu ý:</strong> Nếu tải ảnh mới, toàn bộ ảnh cũ của bài
                viết sẽ bị xóa vĩnh viễn và thay thế bằng danh sách mới.
              </p>
              <UploadListingImage
                initialPreviews={initialImageUrls}
                setFileCallback={(files) => setImages(files)}
                setCoverImageCallback={(index) => setCoverImageIndex(index)}
              />
            </div>
          </section>

          {/* SECTION 4: AMENITIES & DESCRIPTION */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                <List size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                4. Tiện nghi & Mô tả
              </h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Các tiện nghi đi kèm
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
                {amenities?.map((amenity: any) => {
                  const isSelected = form.amenities.includes(amenity.id);
                  const IconComponent =
                    icons[amenity.icon as keyof typeof icons] || Sparkles;

                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="text-[11px] font-bold text-center leading-tight">
                        {amenity.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mô tả đầy đủ
              </label>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <DescriptionEditor
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4 py-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="grow h-14 rounded-2xl bg-slate-900 text-white font-extrabold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Lưu các thay đổi</>
              )}
            </button>
            <button
              onClick={() => router.push("/admin/listings")}
              className="h-14 px-8 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Hủy
            </button>
          </div>
        </div>
      </main>

      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleLocationSelect}
        initialLocation={{
          lat: form.latitude || 21.028511,
          lng: form.longitude || 105.804817,
        }}
      />
    </>
  );
}
