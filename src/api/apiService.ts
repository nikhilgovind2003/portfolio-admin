import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const MEDIA_URL = import.meta.env.VITE_API_URL;  // or hardcoded?

export const apiService = {
  getAll: async (model: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/${model}`);
    return data;
  },

  create: async (endpoint:string, data:object, isFormData:boolean = false) => {
     const config = {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    };

    const res = await axios.post(`${API_BASE_URL}/${endpoint}`, data, config);
    return res.data;
  },

  update: async (model: string, id: string, payload: object) => {
    const { data } = await axios.put(`${API_BASE_URL}/${model}/${id}`, payload);
    return data;
  },

  remove: async (model: string, id: number) => {
    const { data } = await axios.delete(`${API_BASE_URL}/${model}/${id}`);
    return data;
  },
};
