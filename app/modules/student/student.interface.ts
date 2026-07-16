import type {
  BloodGroup,
  Department,
  Gender,
  Religion,
  Shift,
  StudentStatus,
} from "../../generated/prisma-client/client";

export interface CreateStudent {
  schoolId: string;
  classId: string;
  sectionId?: string | null;
  academicYearId: string;
  roll?: string | null;
  nameBn: string;
  nameEn: string;
  phone: string;
  dateOfBirth?: string | null;
  gender: Gender;
  religion: Religion;
  bloodGroup?: BloodGroup | null;
  birthCertificateNo?: string | null;
  nationality?: string;
  presentSchoolName?: string | null;
  photoUrl?: string | null;
  department?: Department | null;
  shift?: Shift | null;
  status?: StudentStatus;
  permanentVillage?: string | null;
  permanentPost?: string | null;
  permanentUpazila?: string | null;
  permanentDistrict?: string | null;
  presentVillage?: string | null;
  presentPost?: string | null;
  presentUpazila?: string | null;
  presentDistrict?: string | null;
  createdBy?: string | null;
}

export interface UpdateStudent
  extends Omit<Partial<CreateStudent>, "schoolId" | "createdBy"> {
  updatedBy?: string | null;
}
