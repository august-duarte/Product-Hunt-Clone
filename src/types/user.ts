export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  created_at: Date | string;
};

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  created_at: Date | string;
};

export type AuthPayload = {
  id: number;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
};

export type UpdatePasswordInput = {
  oldPassword: string;
  newPassword: string;
};
