"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({
  label = "Quay về",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-1 text-text-secondary hover:text-primary transition-colors font-medium text-sm group ${className}`}
      type="button"
    >
      <ChevronLeft
        size={20}
        className="group-hover:-translate-x-1 transition-transform duration-200"
      />
      {label}
    </button>
  );
}
