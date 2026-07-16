import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import type { CreateClass, UpdateClass } from "./class.interface";

class ClassController {
  createClass = async (
    req: Request<unknown, unknown, CreateClass>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, name, displayOrder, isActive } = req.body;
      const schoolClass = await prisma.class.create({
        data: {
          schoolId,
          name,
          displayOrder,
          ...(isActive !== undefined && { isActive }),
        },
      });

      return res.status(201).json({
        message: "Class created successfully",
        data: schoolClass,
      });
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({ message: "Invalid schoolId." });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A class with this name or display order already exists for the school.",
        });
      }

      return res.status(500).json({
        message: "Error creating class",
        error: error.message,
      });
    }
  };

  getClasses = async (
    req: Request<unknown, unknown, unknown, { schoolId?: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId } = req.query;
      const classes = await prisma.class.findMany({
        ...(schoolId && { where: { schoolId } }),
        orderBy: { displayOrder: "asc" },
      });

      return res.status(200).json({
        message: "Classes retrieved successfully",
        data: classes,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving classes",
        error: error.message,
      });
    }
  };

  getClassById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const schoolClass = await prisma.class.findUnique({
        where: { id: req.params.id },
      });

      if (!schoolClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      return res.status(200).json({
        message: "Class retrieved successfully",
        data: schoolClass,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving class",
        error: error.message,
      });
    }
  };

  updateClass = async (
    req: Request<{ id: string }, unknown, UpdateClass>,
    res: Response,
  ): Promise<Response> => {
    try {
      const schoolClass = await prisma.class.update({
        where: { id: req.params.id },
        data: req.body,
      });

      return res.status(200).json({
        message: "Class updated successfully",
        data: schoolClass,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Class not found" });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A class with this name or display order already exists for the school.",
        });
      }

      return res.status(500).json({
        message: "Error updating class",
        error: error.message,
      });
    }
  };

  deleteClass = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      await prisma.class.delete({ where: { id: req.params.id } });

      return res.status(200).json({ message: "Class deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Class not found" });
      }

      if (error.code === "P2003") {
        return res.status(409).json({
          message: "Class cannot be deleted because it is in use.",
        });
      }

      return res.status(500).json({
        message: "Error deleting class",
        error: error.message,
      });
    }
  };
}

export default ClassController;
