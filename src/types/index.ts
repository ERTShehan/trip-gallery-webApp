export interface Trip {
  id: number;
  title: string;
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
}

export interface TravelLog {
  id: string;
  tripId: string;
  note: string;
  mediaLinks: string[];
}

export interface UploadResponse {
  fileName: string;
  fileUrl: string;
  message: string;
}
