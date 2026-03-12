"use client";

import { useEffect, useState } from "react";
import { SendHorizonal, MessageSquare } from "lucide-react";
import DescriptionEditor from "../common/descriptionEditor";
import CommentCard from "../common/commentCard";
import Link from "next/link";
import {
  createComment,
  deleteComment,
  getCommentsByListingId,
  toggleLikeComment,
  updateComment,
} from "@/services/comment.api";
import { toast } from "react-toastify";
import SkeletonLoader from "../common/skeletonLoader";
import { handleError } from "@/utils";


interface ListingCommentsProps {
  listingId: string;
  user: any;
}

export default function ListingComments({
  listingId,
  user,
}: ListingCommentsProps) {
  const [commentContent, setCommentContent] = useState("");
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      if (!listingId) return;
      setIsLoading(true);
      try {
        const res = await getCommentsByListingId(listingId);
        if (res.success) {
          setLocalComments(res.data || []);
        }
      } catch (error) {
        handleError(error, "Error fetching comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [listingId]);

  const handleSubmit = async () => {
    if (!commentContent.trim()) {
      toast.warn("Vui lòng nhập nội dung bình luận.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createComment(listingId, { content: commentContent });
      if (res.success) {
        setLocalComments([res.data, ...localComments]);
        setCommentContent("");
        toast.success("Đã gửi bình luận!");
      }
    } catch (error: any) {
      handleError(error, "Không thể gửi bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const res = await createComment(listingId, {
        content,
        parent_id: parentId,
      });
      if (res.success) {
        setLocalComments(
          localComments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), res.data],
              };
            }
            return c;
          })
        );
        toast.success("Đã trả lời bình luận!");
      }
    } catch (error: any) {
      handleError(error, "Không thể gửi phản hồi.");
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    try {
      const res = await updateComment(id, { content });
      if (res.success) {
        setLocalComments(
          localComments.map((c) => {
            if (c.id === id) return res.data;
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r: any) => (r.id === id ? res.data : r)),
              };
            }
            return c;
          })
        );
        toast.success("Đã cập nhật bình luận!");
      }
    } catch (error: any) {
      handleError(error, "Không thể cập nhật bình luận.");
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await toggleLikeComment(id);
      if (res.success) {
        setLocalComments(
          localComments.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                like_count: res.data.liked
                  ? c.like_count + 1
                  : Math.max(0, c.like_count - 1),
                isLiked: res.data.liked,
              };
            }
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r: any) =>
                  r.id === id
                    ? {
                        ...r,
                        like_count: res.data.liked
                          ? r.like_count + 1
                          : Math.max(0, r.like_count - 1),
                        isLiked: res.data.liked,
                      }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    } catch (error: any) {
      handleError(error, "Không thể thực hiện hành động.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteComment(id);
      if (res.success) {
        setLocalComments(
          localComments
            .filter((c) => c.id !== id)
            .map((c) => ({
              ...c,
              replies: c.replies?.filter((r: any) => r.id !== id),
            }))
        );
        toast.success("Đã xóa bình luận!");
      }
    } catch (error: any) {
      handleError(error, "Không thể xóa bình luận.");
    }
  };

  return (
    <div className="mt-10 mb-16 pt-10 border-t border-slate-200">
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          Bình luận & Đánh giá
          <span className="text-sm font-normal text-slate-500">
            ({localComments?.length || 0})
          </span>
        </h3>

        {/* Comment Input Section */}
        {user ? (
          <div className="flex gap-4 mb-10">
            <div className="hidden sm:flex size-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.full_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <DescriptionEditor
                value={commentContent}
                onChange={setCommentContent}
                placeholder="Viết bình luận của bạn..."
                editorAttributes={{
                  class:
                    "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3 leading-relaxed",
                }}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500"></p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi bình luận"}</span>
                  <SendHorizonal size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10 text-center">
            <p className="text-slate-600 mb-4 font-medium">
              Bạn cần đăng nhập để bình luận bài viết này.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-sm"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {/* Comments List Section */}
        <div className="flex flex-col gap-8">
          {isLoading ? (
            <SkeletonLoader type="comment" count={3} />
          ) : localComments && localComments.length > 0 ? (
            <>
              {localComments.map((item) => (
                <CommentCard
                  key={item.id}
                  comment={item}
                  currentUser={user}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onReply={handleReply}
                  onLike={handleLike}
                />
              ))}
              {localComments.length > 10 && (
                <button className="mt-4 px-6 py-3 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors self-center">
                  Xem thêm bình luận
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
              <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="text-slate-500 font-bold">
                Bài viết chưa có bình luận nào
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
