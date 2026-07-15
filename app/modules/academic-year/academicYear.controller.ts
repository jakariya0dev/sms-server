import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AcademicYearStatus } from "../../generated/prisma-client/enums";

interface AcademicYear {
  schoolId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: AcademicYearStatus;
  isCurrent: boolean;
  isLocked: boolean;
  description?: string;
}

interface UpdateAcademicYear {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  status?: AcademicYearStatus;
  isCurrent?: boolean;
  isLocked?: boolean;
  description?: string | null;
}

class AcademicYearController {
  createAcademicYear = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const {
        schoolId,
        name,
        startDate,
        endDate,
        status,
        isCurrent,
        isLocked,
        description,
      }: AcademicYear = req.body;

      const academicYear = await prisma.academicYear.create({
        data: {
          schoolId,
          name,
          startDate,
          endDate,
          status,
          isCurrent,
          isLocked,
          description,
        },
      });

      // 2. Added explicit return
      return res.status(201).json({
        message: "Academic year created successfully",
        data: academicYear,
      });
    } catch (error: any) {
      // 3. Added specific error handling for foreign key constraint violation
      if (error.code === "P2003") {
        return res.status(400).json({
          message: "Invalid schoolId. The specified school does not exist.",
        });
      }

      return res.status(500).json({
        message: "Error creating academic year",
        error: error.message,
      });
    }
  };

  updateAcademicYear = async (
    req: Request<{ id: string }, unknown, UpdateAcademicYear>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const {
        name,
        startDate,
        endDate,
        status,
        isCurrent,
        isLocked,
        description,
      } = req.body;

      const academicYear = await prisma.academicYear.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(startDate !== undefined && { startDate }),
          ...(endDate !== undefined && { endDate }),
          ...(status !== undefined && { status }),
          ...(isCurrent !== undefined && { isCurrent }),
          ...(isLocked !== undefined && { isLocked }),
          ...(description !== undefined && { description }),
        },
      });

      return res.status(200).json({
        message: "Academic year updated successfully",
        data: academicYear,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Academic year not found" });
      }

      return res.status(500).json({
        message: "Error updating academic year",
        error: error.message,
      });
    }
  };

  getAcademicYears = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const academicYears = await prisma.academicYear.findMany({
        orderBy: { startDate: "desc" },
      });

      return res.status(200).json({
        message: "Academic years retrieved successfully",
        data: academicYears,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving academic years",
        error: error.message,
      });
    }
  };

  getAcademicYearById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: req.params.id },
      });

      if (!academicYear) {
        return res.status(404).json({ message: "Academic year not found" });
      }

      return res.status(200).json({
        message: "Academic year retrieved successfully",
        data: academicYear,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving academic year",
        error: error.message,
      });
    }
  };

  deleteAcademicYear = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      await prisma.academicYear.delete({
        where: { id: req.params.id },
      });

      return res.status(200).json({
        message: "Academic year deleted successfully",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Academic year not found" });
      }

      if (error.code === "P2003") {
        return res.status(409).json({
          message: "Academic year cannot be deleted because it is in use.",
        });
      }

      return res.status(500).json({
        message: "Error deleting academic year",
        error: error.message,
      });
    }
  };
}

export default AcademicYearController;

// test data for academic year creation
// {
//   "schoolId": "sch-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
//   "name": "Academic Year 2026-2027",
//   "startDate": "2026-01-01T00:00:00.000Z",
//   "endDate": "2026-12-31T23:59:59.000Z",
//   "status": "ACTIVE",
//   "isCurrent": true,
//   "isLocked": false,
//   "description": "Main academic session covering the 2026 curriculum, examinations, and fee collections."
// }
