import type { Dispatch, SetStateAction } from "react";

export interface User {
  NRIC: string;
  password: string;
}

export interface LoginProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

export interface HomeProps {
  user: User | null;
}

export interface TextSpinnerProps {
  text: string;
}
