const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

interface LoginResponse {
  token: string;
  user: any;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  }


  async logout(): Promise<void> {
    if (!this.token) return;

    await fetch(`${this.baseURL}/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getUser(): Promise<any> {
    const response = await fetch(`${this.baseURL}/user`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async getRealties(params: Record<string, any> = {}): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseURL}/realties?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<PaginatedResponse<any>>>(response);
    return data.data;
  }

  async getRealty(id: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/realties/${id}`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async createRealty(realtyData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/realties`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(realtyData),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async updateRealty(id: string, updates: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/realties/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async getFeed(params: Record<string, any> = {}): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseURL}/feed?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<PaginatedResponse<any>>>(response);
    return data.data;
  }

  async toggleFavorite(id: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/favorites/${id}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async updatePreferences(preferences: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/preferences`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(preferences),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  // Moderator routes
  async getModerationRealties(params: Record<string, any> = {}): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseURL}/moderation/realties?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<PaginatedResponse<any>>>(response);
    return data.data;
  }

  async updateRealtyStatus(id: string, status: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/moderation/realties/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  // Admin routes
  async createUser(userData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse<ApiResponse<any>>(response);
  }

  async deleteRealty(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/realties/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse<ApiResponse<any>>(response);
  }

  async getStatistics(): Promise<any> {
    const response = await fetch(`${this.baseURL}/admin/statistics`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<any>>(response);
    return data.data;
  }

  async getApplications(params: Record<string, any> = {}): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseURL}/admin/applications?${searchParams.toString()}`, {
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<ApiResponse<PaginatedResponse<any>>>(response);
    return data.data;
  }

  async exportApplications(): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/admin/applications/export`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
}

export const apiService = new ApiService();
export default apiService;
