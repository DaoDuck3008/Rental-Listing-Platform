import { api } from "./api";

export const getAllAmenities = async () => {
  try {
    const res = await api.get("/api/amenities");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAmenityById = async (id: string) => {
  try {
    const res = await api.get(`/api/amenities/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createAmenity = async (data: { name: string; icon?: string }) => {
  try {
    const res = await api.post("/api/amenities", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateAmenity = async (id: string, data: { name: string; icon?: string }) => {
  try {
    const res = await api.put(`/api/amenities/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteAmenity = async (id: string) => {
  try {
    const res = await api.delete(`/api/amenities/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

