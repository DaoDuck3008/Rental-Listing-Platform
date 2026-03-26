import { api } from "./api";

export const getCommentsByListingId = async (listingId: string, page = 1, limit = 10) => {
  const response = await api.get(`/api/comments/listings/${listingId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const createComment = async (listingId: string, data: { content: string, parent_id?: string }) => {
  const response = await api.post(`/api/comments/listings/${listingId}`, data);
  return response.data;
};

export const updateComment = async (commentId: string, data: { content: string }) => {
  const response = await api.put(`/api/comments/${commentId}`, data);
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/api/comments/${commentId}`);
  return response.data;
};
export const toggleLikeComment = async (commentId: string) => {
  const response = await api.post(`/api/comments/${commentId}/likes`);
  return response.data;
};

export const getCommentReplies = async (commentId: string, page = 1, limit = 10) => {
  const response = await api.get(`/api/comments/${commentId}/replies`, {
    params: { page, limit },
  });
  return response.data;
};
