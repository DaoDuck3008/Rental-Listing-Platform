"use client";

import { getUserProfile } from "@/services/user.api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import FillProfileModal from "../user/fillProfileModal";

interface UserProfileProps {
  avatar?: string;
  role?: string;
  gender?: string;
  phone_number?: string;

  canPostListing: boolean;
  profileCompleted: boolean;
}

export default function PostButton({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const router = useRouter();
  const [openFillProfileModal, setFillProfileModal] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileProps | null>(null);

  const handleClick = async () => {
    try {
      const result = await getUserProfile();

      const { canPostListing, profileCompleted } = result.data;
      setUserProfile(result.data.profile);

      if (!profileCompleted) {
        toast.info("Vui lòng hoàn tất hồ sơ cá nhân trước khi đăng tin.");
        setFillProfileModal(true);
        return;
      }

      if (!canPostListing) {
        toast.warning(
          "Bạn không thể đăng bài dưới vai trò là người đi thuê. Vui lòng đổi lại vai trò trong hồ sơ cá nhân."
        );
        setFillProfileModal(true);
        return;
      }

      router.replace("/listing-create");
      return;
    } catch (error: any) {
      const res = error.response.data;
      switch (res.error) {
        case "UNAUTHORIZED":
          toast.warning(res.message);
          break;
        case "NOT_FOUND":
          toast.error(res.message);
          break;
        default:
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          console.error(error);
          break;
      }
      return;
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${
          className ||
          "flex items-center justify-center rounded-lg h-10 px-5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold shadow-sm shadow-blue-500/30 transition-all"
        }`}
      >
        {title || "Đăng tin"}
      </button>

      {openFillProfileModal && (
        <FillProfileModal
          userProfile={userProfile}
          onClose={() => setFillProfileModal(false)}
        />
      )}
    </>
  );
}
