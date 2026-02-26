import { api } from "./api";

export const getAllListingTypes = async () => {
  try {
    const res = await api.get("/api/listing-types");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getListingTypeById = async (id: string) => {
  try {
    const res = await api.get(`/api/listing-types/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createListingType = async (data: { code: string; name: string; description?: string }) => {
  try {
    const res = await api.post("/api/listing-types", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateListingType = async (id: string, data: { code?: string; name?: string; description?: string }) => {
  try {
    const res = await api.put(`/api/listing-types/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteListingType = async (id: string) => {
  try {
    const res = await api.delete(`/api/listing-types/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const searchListingTypes = async (keyword: string) => {
  try {
    const res = await api.get(`/api/listing-types/search?keyword=${keyword}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
