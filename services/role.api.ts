import { api } from "./api";

export const getAllRoles = async () => {
  try {
    const res = await api.get("/api/roles");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getRoleById = async (id: string) => {
  try {
    const res = await api.get(`/api/roles/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const createRole = async (data: { code: string; name: string }) => {
  try {
    const res = await api.post("/api/roles", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateRole = async (id: string, data: { code?: string; name?: string }) => {
  try {
    const res = await api.put(`/api/roles/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const res = await api.delete(`/api/roles/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const searchRoles = async (keyword: string) => {
  try {
    const res = await api.get(`/api/roles/search?keyword=${keyword}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
