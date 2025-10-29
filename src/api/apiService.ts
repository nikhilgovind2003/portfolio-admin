import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiService = {
  getAll: async (model: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/${model}`);
    return data;
  },

  create: async (model: string, payload: any) => {
    const { data } = await axios.post(`${API_BASE_URL}/${model}`, payload);
    return data;
  },

  update: async (model: string, id: string, payload: any) => {
    const { data } = await axios.put(`${API_BASE_URL}/${model}/${id}`, payload);
    return data;
  },

  remove: async (model: string, id: string) => {
    const { data } = await axios.delete(`${API_BASE_URL}/${model}/${id}`);
    return data;
  },
};
