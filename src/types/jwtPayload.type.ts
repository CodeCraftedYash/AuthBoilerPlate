export interface AccessTokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}