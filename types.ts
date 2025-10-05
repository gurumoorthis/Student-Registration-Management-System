import { RoleType, UserStatus } from "./enums";

export interface Department {
  label: string;
  value: string;
}

// export type StatusType = "APPROVED" | "WAITING" | "STUDENT";

export interface Status {
  label: string;
  value: UserStatus;
}

export interface RoleData {
  id: string;
  name: RoleType;
}

export type Role = "SUPER_ADMIN" | "ADMIN" | "STUDENT";
export type Gender = "Male" | "Female" | "Other" | "";
export type Order = "asc" | "desc";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  department: string;
  gender: Gender;
  parent_name: string;
  parent_contact: string;
  blood_group: string;
  created_at: string;
}

export interface User {
  id?: string;
  email: string;
  password: string;
  role_id?: string;
  status: UserStatus;
  created_at?: string;
  auth_id: string;
  name: string;
  phone: string;
  roles?: RoleData;
}
