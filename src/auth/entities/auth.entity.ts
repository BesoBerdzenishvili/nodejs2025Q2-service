export interface SignupDto {
  login: string;
  password: string;
}

export interface LoginDto {
  login: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  login: string;
}
