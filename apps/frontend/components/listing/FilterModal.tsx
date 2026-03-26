import React from "react";
import { X, ChevronDown, RotateCcw } from "lucide-react";
import RangeSlider from "@/components/common/rangeSlider";
import { formatVietnamesePrice } from "@/utils/formatters";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  provinces: any[];
  wards: any[];
  listingTypes: any[];
  amenities: any[];
  toggleAmenity: (id: string) => void;
  handleReset: () => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  setFilters,
  provinces,
  wards,
  listingTypes,
  amenities,
  toggleAmenity,
  handleReset,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-text-main">Bộ lọc tìm kiếm</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-primary text-sm font-bold hover:underline flex items-center gap-1 group"
              >
                <RotateCcw className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                Đặt lại
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-text-main" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Location Filters */}
            <div className="space-y-3">
              <p className="text-text-main text-base font-bold leading-normal">
                Vị trí
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative group">
                  <select
                    className="w-full appearance-none rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm focus:ring-2 ring-primary/20 text-text-main outline-none transition-all pr-10"
                    value={filters.province_code || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        province_code: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                        ward_code: undefined,
                      })
                    }
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces?.map((p: any) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                </div>

                <div className="relative group">
                  <select
                    className="w-full appearance-none rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm focus:ring-2 ring-primary/20 text-text-main outline-none transition-all pr-10 disabled:opacity-50 disabled:bg-slate-50"
                    value={filters.ward_code || ""}
                    disabled={!filters.province_code}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        ward_code: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <option value="">Chọn Quận/Huyện/Phường/Xã</option>
                    {wards?.map((w: any) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-text-main text-base font-bold leading-normal">
                  Khoảng giá
                </p>
                <div className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                  {formatVietnamesePrice(filters.min_price)} -{" "}
                  {formatVietnamesePrice(filters.max_price)}
                </div>
              </div>
              <div className="space-y-6 pt-2">
                <RangeSlider
                  min={0}
                  max={50000000}
                  step={500000}
                  values={[filters.min_price, filters.max_price]}
                  onChange={(values) =>
                    setFilters({
                      ...filters,
                      min_price: values[0],
                      max_price: values[1],
                    })
                  }
                  formatLabel={(val) => formatVietnamesePrice(val)}
                />
              </div>
            </div>

            {/* Area Range */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-text-main text-base font-bold leading-normal">
                  Diện tích
                </p>
                <div className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                  {filters.min_area} m² - {filters.max_area} m²
                </div>
              </div>
              <div className="space-y-6 pt-2">
                <RangeSlider
                  min={0}
                  max={100}
                  step={1}
                  values={[filters.min_area, filters.max_area]}
                  onChange={(values) =>
                    setFilters({
                      ...filters,
                      min_area: values[0],
                      max_area: values[1],
                    })
                  }
                  formatLabel={(val) => `${val} m²`}
                />
              </div>
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <p className="text-text-main text-base font-bold leading-normal">
                Loại bất động sản
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {listingTypes?.map((type: any) => (
                  <label
                    key={type.code}
                    className="flex gap-x-2 items-center cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="listing_type"
                      className="h-4 w-4 rounded border-input-border text-primary focus:ring-0 transition-all"
                      checked={filters.listing_type_code === type.code}
                      onChange={() =>
                        setFilters({ ...filters, listing_type_code: type.code })
                      }
                    />
                    <span className="text-text-main text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {type.name}
                    </span>
                  </label>
                ))}
                <label className="flex gap-x-2 items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="listing_type"
                    className="h-4 w-4 rounded border-input-border text-primary focus:ring-0 transition-all"
                    checked={!filters.listing_type_code}
                    onChange={() =>
                      setFilters({ ...filters, listing_type_code: undefined })
                    }
                  />
                  <span className="text-text-main text-sm font-medium group-hover:text-primary transition-colors">
                    Tất cả
                  </span>
                </label>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-3">
              <p className="text-text-main text-base font-bold leading-normal">
                Phòng ngủ
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[undefined, 1, 2, 3].map((val) => (
                  <button
                    key={val === undefined ? "any" : val}
                    onClick={() => setFilters({ ...filters, beds: val })}
                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                      filters.beds === val
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input-border bg-white hover:border-primary hover:text-primary"
                    }`}
                  >
                    {val === undefined ? "Bất kỳ" : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <p className="text-text-main text-base font-bold leading-normal pt-2">
                Tiện nghi
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities?.map((amenity: any) => (
                  <label
                    key={amenity.id}
                    className="flex gap-x-2 items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input-border text-primary focus:ring-0 transition-all"
                      checked={filters.amenities.includes(amenity.id)}
                      onChange={() => toggleAmenity(amenity.id)}
                    />
                    <span className="text-text-main text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {amenity.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-input-border bg-white text-text-main font-bold hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold transition-colors shadow-md"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
