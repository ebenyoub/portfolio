export type LoginBody = {
    email: string;
    password: string;
};

export type JwtPayload = {
    id: number;
    email: string;
    role: string;
};

export type User = {
  id: number;
  email: string;
  password: string;
  role: string;
};