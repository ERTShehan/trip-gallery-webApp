// API Gateway base URL — empty string allows relative path routing via GCP Load Balancer
export const API_GATEWAY_URL = '';

export const API_ENDPOINTS = {
  trips: `${API_GATEWAY_URL}/trip-service/trips`,
  travelLogs: `${API_GATEWAY_URL}/travel-log-service/travel-logs`,
  mediaUpload: `${API_GATEWAY_URL}/media-service/media/upload`,
};
