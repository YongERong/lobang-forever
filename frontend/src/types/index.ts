import type { Dispatch, SetStateAction } from "react";

export interface User {
  NRIC: string;
  password: string;
}

export interface SingpassLoginProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

export interface LoginProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export interface LogoutProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

export interface HomeProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export interface TextSpinnerProps {
  text: string;
}
