import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const MEDIA_URL = import.meta.env.VITE_MEDIA_API_URL;

export const apiService = {
  getAll: async (
    model: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: boolean;
    }
  ) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status !== undefined)
      queryParams.append("status", String(params.status));

    const url = `${API_BASE_URL}/${model}${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const { data } = await axios.get(url);
    return data;
  },

  create: async (
    endpoint: string,
    data: object,
    isFormData: boolean = false
  ) => {
    const config = {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    };

    const res = await axios.post(`${API_BASE_URL}/${endpoint}`, data, config);
    return res.data;
  },

  update: async (model: string, id: string | number, payload: object) => {
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

    if (response.status === 204) return null;

    try {
      return await response.json();
    } catch {
      return null;
    }
  },

  login: async (payload: object) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, config);

    if(response.status !== 200){
      return {data:null, error: 'Login failed'};
    }
    return {data: response.data, error: null};

  },

     signUp: async (payload: object) => {

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload, config);
       if (response.status !== 201) {
         return {data:null, error: 'Registration failed'};
       }

        return {data: response.data, error: null};
  },
    
    
};
