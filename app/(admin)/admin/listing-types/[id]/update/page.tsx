"use client";

import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "@/components/common/backButton";
import { toast } from "react-toastify";
import { getListingTypeById, updateListingType } from "@/services/listingType.api";
import LoadingOverlay from "@/components/common/loadingOverlay";
import { useRouter, useParams } from "next/navigation";

export default function UpdateListingTypePage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListingType = async () => {
      try {
        const res = await getListingTypeById(id as string);
        if (res.success) {
          setForm({
            code: res.data.code,
            name: res.data.name,
            description: res.data.description || "",
          });
        }
      } catch (error) {
        toast.error("Không thể tải thông tin loại bài đăng");
        router.push("/admin/listing-types");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListingType();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên và mã loại hình");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateListingType(id as string, form);
      setIsSubmitting(false);

      if (res.success) {
        toast.success("Cập nhật loại bài đăng thành công!");
        router.push("/admin/listing-types");
        return;
      }
    } catch (error: any) {
      setIsSubmitting(false);
      const res = error.response?.data;
      toast.error(res?.message || "Đã có lỗi xảy ra!");
    }
  };

  if (loading) return <LoadingOverlay />;

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
              Cập nhật loại bài đăng
            </h1>
            <p className="text-text-secondary text-base">
              Chỉnh sửa thông tin loại hình #{id}
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
                  Thông tin loại hình
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2">
                      Tên loại hình <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Ví dụ: Căn hộ dịch vụ"
                      type="text"
                      value={form.name}
                      name="name"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2">
                      Mã code <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Ví dụ: SERVICE_APARTMENT"
                      type="text"
                      value={form.code}
                      name="code"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2">
                    Mô tả (Tùy chọn)
                  </label>
                  <textarea
                    className="w-full p-4 rounded-lg border border-input-border bg-white text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Nhập mô tả ngắn gọn về loại hình này..."
                    rows={4}
                    value={form.description}
                    name="description"
                    onChange={handleChange}
                  />
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
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </main>

      {isSubmitting && <LoadingOverlay message="Đang cập nhật..." />}
    </>
  );
}
