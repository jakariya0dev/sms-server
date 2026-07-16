import type { AcademicYearStatus } from "../../generated/prisma-client/enums";

export interface AcademicYear {
  schoolId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: AcademicYearStatus;
  isCurrent: boolean;
  isLocked: boolean;
  description?: string;
}

export interface UpdateAcademicYear {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  status?: AcademicYearStatus;
  isCurrent?: boolean;
  isLocked?: boolean;
  description?: string | null;
}
