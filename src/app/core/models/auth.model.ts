export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
  };
  timestamp: string | null;
}

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
}
