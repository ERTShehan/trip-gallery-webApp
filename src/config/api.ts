// API Gateway Load Balancer IP (GCP, provisioned via Phase 21)
export const API_GATEWAY_URL = 'http://35.201.108.108';

export const API_ENDPOINTS = {
  trips: `${API_GATEWAY_URL}/trip-service/trips`,
  travelLogs: `${API_GATEWAY_URL}/travel-log-service/travel-logs`,
  mediaUpload: `${API_GATEWAY_URL}/media-service/media/upload`,
};
