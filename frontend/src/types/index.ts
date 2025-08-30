import type { DatasetElementType } from "@mui/x-charts/internals";
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

export interface SHAPDashboardProps {
  data: DatasetElementType<string | number | Date | null | undefined>[];
  dataKey: string;
}

// Type definitions
export type ChangeType = 'positive' | 'negative' | 'neutral';

export interface MetricProps {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: React.ComponentType<any>;
  description: string;
}

export interface MetricCardProps {
  data: MetricProps;
}

export interface InputField {
  feature: string;
  dtype: string;
}

export interface FormValues {
  [key: string]: string | number;
}
