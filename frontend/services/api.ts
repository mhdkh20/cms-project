import axios from 'axios';
import { API_BASE_URL } from '../constants';

const getHeaders = (isMultipart = false) => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Generic request handler
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => axios.get<T>(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() }).then(res => res.data),
  post: <T>(endpoint: string, body: any) => axios.post<T>(`${API_BASE_URL}${endpoint}`, body, { headers: getHeaders() }).then(res => res.data),
  put: <T>(endpoint: string, body: any) => axios.put<T>(`${API_BASE_URL}${endpoint}`, body, { headers: getHeaders() }).then(res => res.data),
  patch: <T>(endpoint: string, body: any = {}) => axios.patch<T>(`${API_BASE_URL}${endpoint}`, body, { headers: getHeaders() }).then(res => res.data),
  delete: <T>(endpoint: string) => axios.delete<T>(`${API_BASE_URL}${endpoint}`, { headers: getHeaders() }).then(res => res.data),

  postMultipart: <T>(endpoint: string, formData: FormData) =>
    axios.post<T>(`${API_BASE_URL}${endpoint}`, formData, {
      headers: getHeaders(true),
    }).then(res => res.data),

  putMultipart: <T>(endpoint: string, formData: FormData) =>
    axios.put<T>(`${API_BASE_URL}${endpoint}`, formData, {
      headers: getHeaders(true),
    }).then(res => res.data),
};