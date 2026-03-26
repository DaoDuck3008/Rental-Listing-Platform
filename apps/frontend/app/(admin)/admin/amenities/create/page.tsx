"use client";

import { Info, ExternalLink } from "lucide-react";
import { useState } from "react";
import BackButton from "@/components/common/backButton";
import { toast } from "react-toastify";
import { createAmenity } from "@/services/amenities.api";
import LoadingOverlay from "@/components/common/loadingOverlay";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/icon";

export default function CreateAmenityPage() {
  const [form, setForm] = useState({
    name: "",
    icon: "Wifi",
  });
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên tiện ích");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createAmenity(form);
      setIsSubmitting(false);

      if (res.success) {
        toast.success("Tạo tiện ích thành công!");
        router.push("/admin/amenities");
        return;
      }
    } catch (error: any) {
      setIsSubmitting(false);
      const res = error.response?.data;
      toast.error(res?.message || "Đã có lỗi xảy ra!");
    }
  };

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
              Thêm tiện ích mới
            </h1>
            <p className="text-text-secondary text-base">
              Tiện ích này sẽ hiển thị để chủ nhà lựa chọn khi đăng tin.
            </p>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <section className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color bg-gray-50/50 flex items-center gap-3">
                <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-main">
                  Thông tin tiện ích
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Tên tiện ích <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Ví dụ: WiFi tốc độ cao"
                    type="text"
                    value={form.name}
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Mã biểu tượng (Lucide Icon) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Ví dụ: Wifi, Tv, Coffee..."
                        type="text"
                        value={form.icon}
                        name="icon"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="size-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-border-color">
                      <Icon icon={form.icon as any} size={24} />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 items-start">
                    <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 leading-relaxed">
                      <p className="font-bold mb-1">Lưu ý về Biểu tượng:</p>
                      <p>Hệ thống sử dụng thư viện <strong>Lucide Icons</strong>. Vui lòng nhập chính xác tên icon (viết hoa chữ cái đầu, ví dụ: <code className="bg-amber-100 px-1 rounded">Wifi</code>, <code className="bg-amber-100 px-1 rounded">Tv</code>, <code className="bg-amber-100 px-1 rounded">AirVent</code>).</p>
                      <a 
                        href="https://lucide.dev/icons" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline mt-2"
                      >
                        Xem danh sách icon tại lucide.dev
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER BUTTONS */}
            <div className="mx-auto flex items-center justify-end gap-3 w-full">
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
                Lưu tiện ích
              </button>
            </div>
          </form>
        </div>
      </main>

      {isSubmitting && <LoadingOverlay message="Đang tạo tiện ích..." />}
    </>
  );
}
