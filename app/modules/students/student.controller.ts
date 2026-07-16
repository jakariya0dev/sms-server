import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserRole } from "../../generated/prisma-client/enums";
import type { BloodGroup, Department, Gender, Prisma, Religion, Shift, StudentStatus } from "../../generated/prisma-client/client";
import { prisma } from "../../lib/prisma";

interface CreateStudent {
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

interface UpdateStudent extends Omit<Partial<CreateStudent>, "schoolId" | "createdBy"> {
  updatedBy?: string | null;
}

const generateUniqueUsername = async (tx: Prisma.TransactionClient, schoolId: string, name: string): Promise<string> => {
  const baseUsername = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "student";
  for (let suffix = 0; ; suffix += 1) {
    const username = suffix === 0 ? baseUsername : `${baseUsername}.${suffix + 1}`;
    const existingUser = await tx.user.findUnique({ where: { schoolId_username: { schoolId, username } }, select: { id: true } });
    if (!existingUser) return username;
  }
};

class StudentController {
  createStudent = async (req: Request<unknown, unknown, CreateStudent>, res: Response): Promise<Response> => {
    try {
      const { schoolId, classId, sectionId, academicYearId, nameEn, dateOfBirth, createdBy, ...studentData } = req.body;
      const relationshipsAreValid = await this.relationshipsBelongToSchool({ schoolId, classId, sectionId, academicYearId });
      if (!relationshipsAreValid) return res.status(400).json({ message: "classId, sectionId, and academicYearId must belong to the specified schoolId; sectionId must belong to classId." });

      const temporaryPassword = "12345678";
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      const { student, username } = await prisma.$transaction(async (tx) => {
        const username = await generateUniqueUsername(tx, schoolId, nameEn);
        const user = await tx.user.create({
          data: { schoolId, username, password: hashedPassword, role: UserRole.STUDENT, ...(createdBy !== undefined && { createdBy }) },
        });
        const student = await tx.student.create({
          data: {
            schoolId, classId, ...(sectionId !== undefined && { sectionId }), academicYearId, userId: user.id, nameEn,
            ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
            ...(createdBy !== undefined && { createdBy }), ...studentData,
          },
        });
        return { student, username };
      });
      return res.status(201).json({ message: "Student created successfully", data: student, account: { username, temporaryPassword } });
    } catch (error: any) {
      if (error.code === "P2003") return res.status(400).json({ message: "Invalid student relationship." });
      if (error.code === "P2002") return res.status(409).json({ message: "A student account could not be created because a unique value already exists." });
      return res.status(500).json({ message: "Error creating student", error: error.message });
    }
  };

  getStudents = async (req: Request<unknown, unknown, unknown, { schoolId?: string; classId?: string; sectionId?: string; academicYearId?: string; status?: StudentStatus }>, res: Response): Promise<Response> => {
    try {
      const { schoolId, classId, sectionId, academicYearId, status } = req.query;
      const students = await prisma.student.findMany({
        where: { isDeleted: false, ...(schoolId !== undefined && { schoolId }), ...(classId !== undefined && { classId }), ...(sectionId !== undefined && { sectionId }), ...(academicYearId !== undefined && { academicYearId }), ...(status !== undefined && { status }) },
        include: { class: true, section: true, academicYear: true }, orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ message: "Students retrieved successfully", data: students });
    } catch (error: any) {
      return res.status(500).json({ message: "Error retrieving students", error: error.message });
    }
  };

  getStudentById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
      const student = await prisma.student.findFirst({ where: { id: req.params.id, isDeleted: false }, include: { class: true, section: true, academicYear: true } });
      if (!student) return res.status(404).json({ message: "Student not found" });
      return res.status(200).json({ message: "Student retrieved successfully", data: student });
    } catch (error: any) {
      return res.status(500).json({ message: "Error retrieving student", error: error.message });
    }
  };

  updateStudent = async (req: Request<{ id: string }, unknown, UpdateStudent>, res: Response): Promise<Response> => {
    try {
      const existingStudent = await prisma.student.findFirst({ where: { id: req.params.id, isDeleted: false } });
      if (!existingStudent) return res.status(404).json({ message: "Student not found" });

      const { dateOfBirth, ...studentData } = req.body;
      const relationshipsAreValid = await this.relationshipsBelongToSchool({
        schoolId: existingStudent.schoolId, classId: studentData.classId ?? existingStudent.classId,
        sectionId: studentData.sectionId === undefined ? existingStudent.sectionId : studentData.sectionId,
        academicYearId: studentData.academicYearId ?? existingStudent.academicYearId,
      });
      if (!relationshipsAreValid) return res.status(400).json({ message: "classId, sectionId, and academicYearId must belong to the student's school; sectionId must belong to classId." });

      const student = await prisma.student.update({
        where: { id: existingStudent.id }, data: { ...studentData, ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }) },
      });
      return res.status(200).json({ message: "Student updated successfully", data: student });
    } catch (error: any) {
      if (error.code === "P2003") return res.status(400).json({ message: "Invalid student relationship." });
      return res.status(500).json({ message: "Error updating student", error: error.message });
    }
  };

  deleteStudent = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
      const deleted = await prisma.$transaction(async (tx) => {
        const student = await tx.student.findFirst({ where: { id: req.params.id, isDeleted: false }, select: { id: true, userId: true } });
        if (!student) return false;
        const deletedAt = new Date();
        await tx.student.update({ where: { id: student.id }, data: { isDeleted: true, deletedAt } });
        await tx.user.update({ where: { id: student.userId }, data: { isDeleted: true, isActive: false, deletedAt } });
        return true;
      });
      if (!deleted) return res.status(404).json({ message: "Student not found" });
      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting student", error: error.message });
    }
  };

  private async relationshipsBelongToSchool(data: { schoolId: string; classId: string; sectionId?: string | null; academicYearId: string }): Promise<boolean> {
    const [schoolClass, academicYear, section] = await Promise.all([
      prisma.class.findFirst({ where: { id: data.classId, schoolId: data.schoolId }, select: { id: true } }),
      prisma.academicYear.findFirst({ where: { id: data.academicYearId, schoolId: data.schoolId }, select: { id: true } }),
      data.sectionId ? prisma.section.findFirst({ where: { id: data.sectionId, schoolId: data.schoolId, classId: data.classId }, select: { id: true } }) : Promise.resolve({ id: "none" }),
    ]);
    return Boolean(schoolClass && academicYear && section);
  }
}

export default StudentController;
