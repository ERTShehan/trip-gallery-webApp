import axios from 'axios';
import type { Trip, TravelLog, UploadResponse } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const tripApi = {
  getAll: () => axios.get<Trip[]>(API_ENDPOINTS.trips),
  getById: (id: number) => axios.get<Trip>(`${API_ENDPOINTS.trips}/${id}`),
  create: (trip: Omit<Trip, 'id'>) => axios.post<Trip>(API_ENDPOINTS.trips, trip),
  update: (id: number, trip: Partial<Trip>) => axios.put<Trip>(`${API_ENDPOINTS.trips}/${id}`, trip),
  delete: (id: number) => axios.delete(`${API_ENDPOINTS.trips}/${id}`),
};

export const travelLogApi = {
  getAll: () => axios.get<TravelLog[]>(API_ENDPOINTS.travelLogs),
  getByTripId: (tripId: string) =>
    axios.get<TravelLog[]>(`${API_ENDPOINTS.travelLogs}/trip/${tripId}`),
  create: (log: Omit<TravelLog, 'id'>) =>
    axios.post<TravelLog>(API_ENDPOINTS.travelLogs, log),
  delete: (id: string) => axios.delete(`${API_ENDPOINTS.travelLogs}/${id}`),
};

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<UploadResponse>(API_ENDPOINTS.mediaUpload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
