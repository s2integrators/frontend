// src/services/auth.ts
import { axiosApi } from "./api"; // adjust path if your api.ts is elsewhere

type LoginResp = { access_token: string; token_type?: string };

export async function login(email: string, password: string) {
  const resp = await axiosApi.post<LoginResp>("/auth/login", { email, password });
  const token = resp.data?.access_token;
  if (!token) throw new Error("No token received from server");
  localStorage.setItem("access_token", token);
  return resp.data;
}

export async function getCurrentUser() {
  const resp = await axiosApi.get("/auth/me");
  return resp.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  // optional: axiosApi.post('/auth/logout')
}
