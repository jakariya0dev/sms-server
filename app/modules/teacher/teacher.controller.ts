import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../generated/prisma-client/enums";
import type {
  BloodGroup,
  Department,
  EmployeeStatus,
  Gender,
  Prisma,
  Religion,
  Shift,
} from "../../generated/prisma-client/client";

interface CreateTeacher {
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

interface UpdateTeacher {
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

const generateUniqueUsername = async (
  tx: Prisma.TransactionClient,
  schoolId: string,
  name: string,
): Promise<string> => {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  const baseUsername = normalizedName || "teacher";

  for (let suffix = 0; ; suffix += 1) {
    const username =
      suffix === 0 ? baseUsername : `${baseUsername}.${suffix + 1}`;
    const existingUser = await tx.user.findUnique({
      where: { schoolId_username: { schoolId, username } },
      select: { id: true },
    });

    if (!existingUser) return username;
  }
};

class TeacherController {
  createTeacher = async (
    req: Request<unknown, unknown, CreateTeacher>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, name, email, createdBy, ...teacherData } = req.body;
      const temporaryPassword = "12345678";
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const { teacher, username } = await prisma.$transaction(async (tx) => {
        const username = await generateUniqueUsername(tx, schoolId, name);
        const user = await tx.user.create({
          data: {
            schoolId,
            username,
            password: hashedPassword,
            role: UserRole.TEACHER,
            ...(email !== undefined && { email }),
            ...(createdBy !== undefined && { createdBy }),
          },
        });

        const teacher = await tx.teacher.create({
          data: {
            schoolId,
            userId: user.id,
            name,
            ...(email !== undefined && { email }),
            ...(createdBy !== undefined && { createdBy }),
            ...teacherData,
          },
        });

        return { teacher, username };
      });

      return res.status(201).json({
        message: "Teacher created successfully",
        data: teacher,
        account: { username, temporaryPassword },
      });
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({ message: "Invalid schoolId." });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message:
            "A teacher account could not be created because a unique value already exists.",
        });
      }

      return res.status(500).json({
        message: "Error creating teacher",
        error: error.message,
      });
    }
  };

  getTeachers = async (
    req: Request<unknown, unknown, unknown, { schoolId?: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId } = req.query;
      const teachers = await prisma.teacher.findMany({
        where: {
          isDeleted: false,
          ...(schoolId !== undefined && { schoolId }),
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        message: "Teachers retrieved successfully",
        data: teachers,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving teachers",
        error: error.message,
      });
    }
  };

  getTeacherById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const teacher = await prisma.teacher.findFirst({
        where: { id: req.params.id, isDeleted: false },
      });

      if (!teacher)
        return res.status(404).json({ message: "Teacher not found" });

      return res.status(200).json({
        message: "Teacher retrieved successfully",
        data: teacher,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving teacher",
        error: error.message,
      });
    }
  };

  updateTeacher = async (
    req: Request<{ id: string }, unknown, UpdateTeacher>,
    res: Response,
  ): Promise<Response> => {
    try {
      const existingTeacher = await prisma.teacher.findFirst({
        where: { id: req.params.id, isDeleted: false },
      });

      if (!existingTeacher)
        return res.status(404).json({ message: "Teacher not found" });

      const teacher = await prisma.teacher.update({
        where: { id: existingTeacher.id },
        data: req.body,
      });

      return res.status(200).json({
        message: "Teacher updated successfully",
        data: teacher,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error updating teacher",
        error: error.message,
      });
    }
  };

  deleteTeacher = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const deleted = await prisma.$transaction(async (tx) => {
        const teacher = await tx.teacher.findFirst({
          where: { id: req.params.id, isDeleted: false },
          select: { id: true, userId: true },
        });

        if (!teacher) return false;

        await tx.teacher.delete({ where: { id: teacher.id } });
        await tx.user.delete({ where: { id: teacher.userId } });
        return true;
      });

      if (!deleted)
        return res.status(404).json({ message: "Teacher not found" });

      return res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error deleting teacher",
        error: error.message,
      });
    }
  };
}

export default TeacherController;
