"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, CheckCircle, Camera } from "lucide-react";

export default function Dropzone({
  setAvatarCallback,
  currentAvatar,
}: {
  setAvatarCallback: (file: File | null) => void;
  currentAvatar?: string;
}) {
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Hàm xử lý khi thả file vào vùng dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selected = acceptedFiles[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setAvatarCallback(selected);
  }, []);

  // Cấu hình Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Hàm xoá ảnh đã chọn
  const removeImage = () => {
    setFile(null);
    setPreview("");
  };

  return (
    <div className="w-full border-4 border-dashed border-gray-300 hover:border-gray-400 rounded-3xl p-5 bg-white">
      {/* Nếu chưa upload file */}
      {!file && (
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center text-center cursor-pointer"
        >
          <input {...getInputProps()} />

          <div className=" rounded-full bg-blue-50 flex items-center justify-center p-4 mb-4">
            {isDragActive && <Upload size={50} className=" text-blue-600" />}
            {!isDragActive && <Camera size={50} className=" text-blue-600" />}
          </div>

          <h2 className=" font-semibold mb-2">
            Kéo & thả ảnh đại diện vào đây
          </h2>

          {/* Nút chọn ảnh */}
          <div className="bg-blue-500 transition hover:-translate-y-1 text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Chọn ảnh từ máy
          </div>
        </div>
      )}

      {currentAvatar && !file && (
        <div className="flex flex-col items-center mt-2">
          {/* Preview Image */}
          <div className="relative">
            <div className="text-center font-semibold mb-1">Ảnh hiện tại</div>
            <Image
              src={currentAvatar}
              alt="Preview"
              width={150}
              height={150}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      )}

      {/* Nếu đã upload file */}
      {file && (
        <div className="flex flex-col items-center">
          {/* Preview Image */}
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-2xl shadow-lg object-cover"
            />

            {/* Nút X xoá ảnh */}
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>

          {/* File info */}
          <div className="mt-3 bg-green-50 border border-green-300 px-6 py-2 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <p className="font-medium max-w-40 truncate">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
