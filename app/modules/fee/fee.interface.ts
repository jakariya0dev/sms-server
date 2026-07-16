import type { FeeFrequency } from "../../generated/prisma-client/enums";

export interface CreateFeeCategory {
  schoolId: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateFeeCategory {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreateFeeStructure {
  schoolId: string;
  academicYearId: string;
  classId: string;
  feeCategoryId: string;
  amount: number | string;
  discount?: number | string | null;
  lateFee?: number | string | null;
  dueDate?: string | null;
  frequency: FeeFrequency;
  isActive?: boolean;
}

export interface UpdateFeeStructure {
  academicYearId?: string;
  classId?: string;
  feeCategoryId?: string;
  amount?: number | string;
  discount?: number | string | null;
  lateFee?: number | string | null;
  dueDate?: string | null;
  frequency?: FeeFrequency;
  isActive?: boolean;
}
