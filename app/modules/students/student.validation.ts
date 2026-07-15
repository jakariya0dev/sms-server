import { z } from "zod";

// Enums
const DepartmentEnum = z.enum([
  "GENERAL",
  "SCIENCE",
  "COMMERCE",
  "ARTS",
  "VOCATIONAL",
  "OTHER",
]);
const ShiftEnum = z.enum(["MORNING", "DAY", "EVENING", "NIGHT"]);
const StudentStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "GRADUATED",
  "TRANSFERRED",
  "DROPPED",
  "RUSTICATED",
]);
const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const ReligionEnum = z.enum([
  "ISLAM",
  "HINDUISM",
  "CHRISTIANITY",
  "BUDDHISM",
  "OTHER",
]);
const BloodGroupEnum = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);
const StudentGuardianTypeEnum = z.enum(["FATHER", "MOTHER", "LOCAL_GUARDIAN"]);

// Guardian validation schema
const createGuardianValidationSchema = z.object({
  relationType: StudentGuardianTypeEnum,
  nameBn: z.string({ message: "Guardian name in Bangla is required" }),
  nameEn: z.string({ message: "Guardian name in English is required" }),
  dateOfBirth: z.coerce.date().optional(),
  nationalId: z.string().optional(),
  profession: z.string().optional(),
  mobile: z.string({ message: "Guardian mobile number is required" }),
  email: z.email({ message: "Invalid email address" }).optional(),
  yearlyIncome: z.number().min(0).optional(),
  isPrimary: z.boolean().default(false),
});

// Main request body validation schema
export const createStudentZodSchema = z.object({
  body: z.object({
    // Student basic information
    schoolId: z.uuid({ message: "Invalid or Missing School ID" }),
    classId: z.uuid({ message: "Invalid Class ID format" }),
    sectionId: z.uuid({ message: "Invalid Section ID format" }).optional(),
    academicYearId: z.uuid({ message: "Invalid or Missing Academic Year ID" }),
    roll: z.string().optional(),

    nameBn: z.string({ message: "Student name in Bangla is required" }),
    nameEn: z.string({ message: "Student name in English is required" }),
    phone: z.string({ message: "Student phone number is required" }),
    dateOfBirth: z.coerce.date({ message: "Date of birth is required" }),
    gender: GenderEnum,
    religion: ReligionEnum,
    bloodGroup: BloodGroupEnum.optional(),
    birthCertificateNo: z.string().optional(),
    nationality: z.string().default("Bangladeshi"),
    presentSchoolName: z.string().optional(),
    photoUrl: z.url({ message: "Invalid photo URL" }).optional(),

    department: DepartmentEnum.default("GENERAL"),
    shift: ShiftEnum.default("DAY"),
    status: StudentStatusEnum.default("ACTIVE"),

    // Address details
    permanentVillage: z.string().optional(),
    permanentPost: z.string().optional(),
    permanentUpazila: z.string().optional(),
    permanentDistrict: z.string().optional(),

    presentVillage: z.string().optional(),
    presentPost: z.string().optional(),
    presentUpazila: z.string().optional(),
    presentDistrict: z.string().optional(),

    // Optional arrays for relations
    guardians: z.array(createGuardianValidationSchema).optional(),
  }),
});
