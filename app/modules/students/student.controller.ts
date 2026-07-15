import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

class StudentController {
  async createStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        // Student profile details
        classId,
        sectionId,
        academicYearId,
        roll,
        nameBn,
        nameEn,
        phone,
        dateOfBirth,
        gender,
        religion,
        bloodGroup,
        birthCertificateNo,
        nationality,
        presentSchoolName,
        photoUrl,
        department,
        shift,

        // Address details
        permanentVillage,
        permanentPost,
        permanentUpazila,
        permanentDistrict,
        presentVillage,
        presentPost,
        presentUpazila,
        presentDistrict,

        // Guardian details
      } = req.body;

      // TODO: Perform validation (can be replaced with a Zod schema validation middleware)

      // TODO: user account creation logic with username and password

      // insert student data into the database
      // cast to any to avoid strict Prisma Client create input type issues
      const newStudent = await prisma.student.create({
        data: {
          classId,
          sectionId,
          academicYearId,
          roll,
          nameBn,
          nameEn,
          phone,
          dateOfBirth,
          gender,
          religion,
          bloodGroup,
          birthCertificateNo,
          nationality,
          presentSchoolName,
          photoUrl,
          department,
          shift,
          permanentVillage,
          permanentPost,
          permanentUpazila,
          permanentDistrict,
          presentVillage,
          presentPost,
          presentUpazila,
          presentDistrict,
        } as any,
      });

      // 4. Return the successful response
      res.status(201).json({
        success: true,
        message: "Student added successfully.",
        data: newStudent,
      });
    } catch (error: any) {
      // Pass errors to global Express error handling middleware
      if (error.message.includes("exists")) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

}

export default StudentController;
