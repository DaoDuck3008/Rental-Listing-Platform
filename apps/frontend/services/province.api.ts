import axios from "axios";

const provinceApi = axios.create({
  baseURL: "https://provinces.open-api.vn/api/v2/",
  timeout: 3000,
});

export const getProvinces = async () => {
  const res = await provinceApi.get("/p");
  return res.data;
};

export const getWardsByProvince = async (province_code: number) => {
  const res = await provinceApi.get(`/w?province=${province_code}`);
  return res.data;
};

export const getProvinceById = async (code: string | number) => {
  const res = await provinceApi.get(`/p/${code}`);
  return res.data;
};

export const getWardById = async (code: string | number) => {
  const res = await provinceApi.get(`/w/${code}`);
  return res.data;
};
