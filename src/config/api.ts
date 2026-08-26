// API Gateway base URL — change to GCP URL when deployed
export const API_GATEWAY_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  trips: `${API_GATEWAY_URL}/trip-service/trips`,
  travelLogs: `${API_GATEWAY_URL}/travel-log-service/travel-logs`,
  mediaUpload: `${API_GATEWAY_URL}/media-service/media/upload`,
};
