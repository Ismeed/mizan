export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPremium?: boolean;
  emailVerified?: boolean;
  country?: string;
  currency?: string;
  madhhab?: string;
  profileImageUrl?: string;
  avatarUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
