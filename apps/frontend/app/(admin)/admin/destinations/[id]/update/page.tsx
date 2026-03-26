"use client";

import { useProvinces, useWardsByProvince } from "@/hooks/useProvinces";
import { ChevronDown, Info, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import BackButton from "@/components/common/backButton";
import { toast } from "react-toastify";
import { CreateDestinationValidate } from "@/schema/Destination.validator";
import {
  getDestinationById,
  updateDestination,
} from "@/services/destination.api";
import LoadingOverlay from "@/components/common/loadingOverlay";
import { useRouter, useParams } from "next/navigation";
import MapPickerModal from "@/components/listing/mapPickerModal";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

interface FormState {
  name: string;
  type: string;
  province_code: number | null;
  ward_code: number | null;
  address: string;
  longitude: number | null;
  latitude: number | null;
}

export default function UpdateDestinationPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "UNIVERSITY",
    province_code: null,
    ward_code: null,
    address: "",
    longitude: null,
    latitude: null,
  });

  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if (!id) return;

    const fetchDestination = async () => {
      try {
        setIsFetching(true);
        const res = await getDestinationById(id);
        if (res.data?.success) {
          const d = res.data.data;
          setForm({
            name: d.name || "",
            type: d.type || "UNIVERSITY",
            province_code: d.province_code ?? null,
            ward_code: d.ward_code ?? null,
            address: d.address || "",
            longitude: d.longitude ?? null,
            latitude: d.latitude ?? null,
          });
        }
      } catch (error: any) {
        const res = error.response?.data;
        toast.error(res?.message || "Không thể tải thông tin địa danh!");
        router.push("/admin/destinations");
      } finally {
        setIsFetching(false);
      }
    };

    fetchDestination();
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

  const handleSubmit = async () => {
    try {
      if (!CreateDestinationValidate(form)) return;
      setIsSubmitting(true);
      const res = await updateDestination(id, form);
      setIsSubmitting(false);

      if (res.status === 200) {
        toast.success("Cập nhật địa danh thành công!");
        router.push("/admin/destinations");
        return;
      }
    } catch (error: any) {
      setIsSubmitting(false);
      const res = error.response?.data;
      if (res) {
        toast.error(res?.message || "Đã có lỗi xảy ra!");
      } else {
        toast.error("Đã có lỗi xảy ra!");
        console.error(error);
      }
    }
  };

  if (!isLoaded || isFetching) return <LoadingOverlay />;

  return (
    <>
      <main className="grow py-8 px-4 sm:px-6">
        <div className="max-w-240 mx-auto">
          {/* BACK BUTTON */}
          <div className="mb-4">
            <BackButton />
          </div>

          {/* TIÊU ĐỀ */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-black text-text-main tracking-tight mb-2">
              Chỉnh sửa địa danh
            </h1>
            <p className="text-text-secondary text-base">
              Cập nhật thông tin địa danh phổ biến trên nền tảng.
            </p>
          </div>

          {/* DESTINATION FORM */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* SECTION 1: BASIC INFORMATION */}
            <section className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color bg-gray-50/50 flex items-center gap-3">
                <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-main">
                  1. Thông tin cơ bản
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Tên địa danh <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
                    type="text"
                    value={form.name}
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Loại địa danh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full h-12 px-4 appearance-none rounded-lg border border-input-border bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="UNIVERSITY">Đại học</option>
                      <option value="MALL">Trung tâm thương mại</option>
                      <option value="HOSPITAL">Bệnh viện</option>
                      <option value="PARK">Công viên</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: ADDRESS AND LOCATION */}
            <section className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color bg-gray-50/50 flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-main">
                  2. Địa chỉ &amp; Vị trí
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <div className="relative">
                    <select
                      onChange={handleProvinceChange}
                      name="province_code"
                      value={form.province_code || ""}
                      className="w-full h-12 px-4 appearance-none rounded-lg border border-input-border bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Chọn Tỉnh/ Thành phố</option>
                      {!provinceIsLoading &&
                        provinces &&
                        provinces.map((p: any) => (
                          <option key={p.code} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Phường/Xã
                  </label>
                  <div className="relative">
                    <select
                      onChange={handleWardChange}
                      name="ward_code"
                      value={form.ward_code || ""}
                      disabled={!form.province_code}
                      className={`w-full h-12 px-4 appearance-none rounded-lg border border-input-border bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        !form.province_code ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {!wardIsLoading &&
                        wards &&
                        wards.map((w: any) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Tìm kiếm địa chỉ để lấy tọa độ
                  </label>
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
                      className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Số nhà, tên đường, khu dân cư..."
                      type="text"
                    />
                  </Autocomplete>
                </div>

                <div
                  onClick={() => setIsMapModalOpen(true)}
                  className="md:col-span-2 rounded-xl overflow-hidden h-72 relative bg-gray-200 border border-input-border group cursor-pointer transition-all hover:ring-2 ring-primary/20"
                >
                  <img
                    alt="Map view"
                    className="w-full h-full object-cover transition-all group-hover:scale-105"
                    src={
                      form.latitude && form.longitude
                        ? `https://maps.googleapis.com/maps/api/staticmap?center=${form.latitude},${form.longitude}&zoom=17&size=800x400&markers=color:red%7C${form.latitude},${form.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                        : "https://lh3.googleusercontent.com/aida-public/AB6AXuCeAVSSsPmznwMIv5cR4lgMGVP4Z_UB8rLGSXonecm9SD-7lHW21mu1vLPCUiWYSCURucpYJTyaeofJguU0XlyA9e3WJVZ3ZMtNhnEYRble5c0NKt2JXhezQtUNXZAbzHRSMD6TfLHAk1Aj7WRw29eA4jTzZWiWw3Xcv9_kSGB91cNdectrEl_PjXkJ4MBA89qA2lt8jvHfhzH7eE3UlqgXyvKjROWg10wqlKc7M92rbMnVdyBvg2riDZd-g4Ku7DhsJcdomZlYfEMR"
                    }
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                    <div className="bg-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-primary font-bold transform transition-transform group-hover:scale-110 active:scale-95">
                      <MapPin size={22} className="animate-bounce" />
                      <span>
                        {form.latitude
                          ? "Thay đổi vị trí trên bản đồ"
                          : "Chọn địa chỉ chính xác trên bản đồ"}
                      </span>
                    </div>
                  </div>
                  {form.latitude && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-text-secondary border border-border-color shadow-sm">
                      Đã xác định tọa độ: {form.latitude.toFixed(6)},{" "}
                      {form.longitude?.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* FOOTER BUTTONS */}
            <div className="sticky bottom-0 z-40 bg-white border-t border-border-color -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="mx-auto flex items-center justify-end gap-3">
                <button
                  className="cursor-pointer h-12 px-6 rounded-lg border border-input-border bg-white text-text-main font-bold text-sm hover:bg-gray-50 transition-colors"
                  type="button"
                  onClick={() => router.back()}
                >
                  Hủy bỏ
                </button>
                <button
                  className="h-12 px-8 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98]"
                  type="button"
                  onClick={handleSubmit}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {isSubmitting && <LoadingOverlay message="Đang cập nhật địa danh..." />}

      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleLocationSelect}
        initialLocation={
          form.latitude && form.longitude
            ? { lat: form.latitude, lng: form.longitude }
            : null
        }
      />
    </>
  );
}
