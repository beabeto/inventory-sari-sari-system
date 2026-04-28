const API_URL = 'http://localhost:3000';
const PROFILE_STORAGE_KEY = 'current_user_profile';

interface LoginResponse {
  access_token: string;
}

export interface StoredProfile {
  username: string;
  profileImage: string | null;
}

// LOGIN
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Try to read the error message from backend
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Login failed';
      throw new Error(message);
    }

    const data: LoginResponse = await response.json();

    // Save JWT token
    localStorage.setItem('token', data.access_token);

    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

// LOGOUT
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

// GET TOKEN
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// CHECK IF USER IS LOGGED IN
export function isAuthenticated(): boolean {
  return !!getToken();
}

export function authHeader() {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function getStoredProfile(): StoredProfile | null {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredProfile;
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
}

export function setStoredProfile(profile: StoredProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
