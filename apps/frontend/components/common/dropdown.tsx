"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  title: string;
  options: { label: string; value: any }[];
  value?: any;
  onChange?: (value: any) => void;
}

export default function Dropdown({
  title,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const selectedOption = options.find(
    (opt) => JSON.stringify(opt.value) === JSON.stringify(value)
  );

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-100  text-slate-700  font-semibold text-sm transition-colors"
      >
        <span>{selectedOption ? selectedOption.label : title}</span>
        <span className="material-symbols-outlined text-lg">
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute mt-2 w-max min-w-40 rounded-md bg-white shadow-lg overflow-hidden border border-slate-100 z-50">
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
