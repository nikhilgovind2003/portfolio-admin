import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const MEDIA_URL = import.meta.env.VITE_MEDIA_API_URL;  // or hardcoded?

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

  update: async (model: string, id: string|number, payload: object) => {
    const { data } = await axios.put(`${API_BASE_URL}/${model}/${id}`, payload);
    return data;
  },

  async remove(path: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/${path}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Delete failed");
  }

  // Handle 204 No Content safely
  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    return null; // No JSON body
  }
}

};
