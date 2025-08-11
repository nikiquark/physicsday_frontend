import { getCookie } from "@/lib/cookie";
import { API_BASE_URL } from "@/lib/constants";

// Types
export interface BaseParticipantData {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface PhysicsDayParticipantData extends BaseParticipantData {
  role: string;
  school: string | null;
  class_number: number | null;
}

export interface OlympiadParticipantData extends BaseParticipantData {
  school: string;
  class_number: number;
}

export interface WorkshopParticipantData extends BaseParticipantData {
  school: string;
  class_number: number;
  workshop: number;
}

export interface Workshop {
  id: number;
  name: string;
  restriction: string;
  time: string;
  room: string;
  limit: number;
  limit_left: number;
  ordering: number;
  image: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const csrfToken = getCookie('csrftoken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.detail || `HTTP error! status: ${response.status}`,
        status: response.status,
        details: errorData
      };
      throw error;
    }

    return response.json();
  }

  // Physics Day participants
  async createPhysicsDayParticipant(data: PhysicsDayParticipantData): Promise<any> {
    return this.makeRequest('/physicsday/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Olympiad participants
  async createOlympiadParticipant(data: OlympiadParticipantData): Promise<any> {
    return this.makeRequest('/olympiads/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Workshop participants
  async createWorkshopParticipant(data: WorkshopParticipantData): Promise<any> {
    return this.makeRequest('/workshops/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Workshops
  async getWorkshops(): Promise<Workshop[]> {
    return this.makeRequest('/workshops/');
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && 'status' in error) {
    const apiError = error as ApiError;
    
    if (apiError.message.includes('Failed to fetch')) {
      return 'Не удается подключиться к серверу. Проверьте подключение к интернету.';
    }
    
    switch (apiError.status) {
      case 400:
        return 'Проверьте правильность заполнения всех полей.';
      case 406:
        return 'К сожалению, места на этот мастер-класс закончились.';
      case 500:
        return 'Ошибка сервера. Попробуйте позже.';
      default:
        return apiError.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Произошла неизвестная ошибка. Попробуйте позже.';
};