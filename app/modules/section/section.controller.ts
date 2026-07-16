import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import type { CreateSection, UpdateSection } from "./section.interface";

class SectionController {
  createSection = async (
    req: Request<unknown, unknown, CreateSection>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, classId, name, displayOrder, isActive } = req.body;

      const schoolClass = await prisma.class.findFirst({
        where: { id: classId, schoolId },
      });

      if (!schoolClass) {
        return res.status(400).json({
          message: "classId must belong to the specified schoolId.",
        });
      }

      const section = await prisma.section.create({
        data: {
          schoolId,
          classId,
          name,
          displayOrder,
          ...(isActive !== undefined && { isActive }),
        },
      });

      return res.status(201).json({
        message: "Section created successfully",
        data: section,
      });
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({
          message: "Invalid schoolId or classId.",
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A section with this name or display order already exists for the school.",
        });
      }

      return res.status(500).json({
        message: "Error creating section",
        error: error.message,
      });
    }
  };

  getSections = async (
    req: Request<unknown, unknown, unknown, { schoolId?: string; classId?: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, classId } = req.query;
      const sections = await prisma.section.findMany({
        where: {
          ...(schoolId !== undefined && { schoolId }),
          ...(classId !== undefined && { classId }),
        },
        orderBy: { displayOrder: "asc" },
      });

      return res.status(200).json({
        message: "Sections retrieved successfully",
        data: sections,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving sections",
        error: error.message,
      });
    }
  };

  getSectionById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const section = await prisma.section.findUnique({
        where: { id: req.params.id },
      });

      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }

      return res.status(200).json({
        message: "Section retrieved successfully",
        data: section,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving section",
        error: error.message,
      });
    }
  };

  updateSection = async (
    req: Request<{ id: string }, unknown, UpdateSection>,
    res: Response,
  ): Promise<Response> => {
    try {
      const section = await prisma.section.update({
        where: { id: req.params.id },
        data: req.body,
      });

      return res.status(200).json({
        message: "Section updated successfully",
        data: section,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Section not found" });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A section with this name or display order already exists for the school.",
        });
      }

      return res.status(500).json({
        message: "Error updating section",
        error: error.message,
      });
    }
  };

  deleteSection = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      await prisma.section.delete({ where: { id: req.params.id } });

      return res.status(200).json({ message: "Section deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Section not found" });
      }

      if (error.code === "P2003") {
        return res.status(409).json({
          message: "Section cannot be deleted because it is in use.",
        });
      }

      return res.status(500).json({
        message: "Error deleting section",
        error: error.message,
      });
    }
  };
}

export default SectionController;
