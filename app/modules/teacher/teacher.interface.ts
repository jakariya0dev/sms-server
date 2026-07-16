import type { BloodGroup, Department, EmployeeStatus, Gender, Religion, Shift } from "../../generated/prisma-client/client";

export interface CreateTeacher {
  schoolId: string;
  name: string;
  designation?: string | null;
  specialization?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  religion?: Religion | null;
  bloodGroup?: BloodGroup | null;
  department?: Department | null;
  shift?: Shift | null;
  status?: EmployeeStatus | null;
  createdBy?: string | null;
}

export interface UpdateTeacher {
  name?: string;
  designation?: string | null;
  specialization?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  religion?: Religion | null;
  bloodGroup?: BloodGroup | null;
  department?: Department | null;
  shift?: Shift | null;
  status?: EmployeeStatus | null;
  updatedBy?: string | null;
}
