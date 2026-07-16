import type { Request, Response } from "express";
import { FeeFrequency } from "../../generated/prisma-client/enums";
import { prisma } from "../../lib/prisma";

interface CreateFeeCategory {
  schoolId: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

interface UpdateFeeCategory {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

interface CreateFeeStructure {
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

interface UpdateFeeStructure {
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

class FeeController {
  createCategory = async (
    req: Request<unknown, unknown, CreateFeeCategory>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, name, description, isActive } = req.body;

      // return res.json({ msg: "test", data: req.body });

      if (!schoolId || !name) {
        return res.status(400).json({
          message: "schoolId and name are required.",
        });
      }

      const category = await prisma.feeCategory.create({ data: req.body });
      return res
        .status(201)
        .json({ message: "Fee category created successfully", data: category });
    } catch (error: any) {
      if (error.code === "P2003")
        return res.status(400).json({ message: "Invalid schoolId." });
      if (error.code === "P2002")
        return res.status(409).json({
          message:
            "A fee category with this name already exists for the school.",
        });
      return res
        .status(500)
        .json({ message: "Error creating fee category", error: error.message });
    }
  };

  getCategories = async (
    req: Request<
      unknown,
      unknown,
      unknown,
      { schoolId?: string; isActive?: string }
    >,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, isActive } = req.query;
      const categories = await prisma.feeCategory.findMany({
        where: {
          ...(schoolId !== undefined && { schoolId }),
          ...(isActive !== undefined && { isActive: isActive === "true" }),
        },
        orderBy: { name: "asc" },
      });
      return res.status(200).json({
        message: "Fee categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving fee categories",
        error: error.message,
      });
    }
  };

  getCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const category = await prisma.feeCategory.findUnique({
        where: { id: req.params.id },
      });
      if (!category)
        return res.status(404).json({ message: "Fee category not found" });
      return res.status(200).json({
        message: "Fee category retrieved successfully",
        data: category,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving fee category",
        error: error.message,
      });
    }
  };

  updateCategory = async (
    req: Request<{ id: string }, unknown, UpdateFeeCategory>,
    res: Response,
  ): Promise<Response> => {
    try {
      const category = await prisma.feeCategory.update({
        where: { id: req.params.id },
        data: req.body,
      });
      return res
        .status(200)
        .json({ message: "Fee category updated successfully", data: category });
    } catch (error: any) {
      if (error.code === "P2025")
        return res.status(404).json({ message: "Fee category not found" });
      if (error.code === "P2002")
        return res.status(409).json({
          message:
            "A fee category with this name already exists for the school.",
        });
      return res
        .status(500)
        .json({ message: "Error updating fee category", error: error.message });
    }
  };

  deleteCategory = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      await prisma.feeCategory.delete({ where: { id: req.params.id } });
      return res
        .status(200)
        .json({ message: "Fee category deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025")
        return res.status(404).json({ message: "Fee category not found" });
      if (error.code === "P2003")
        return res.status(409).json({
          message: "Fee category cannot be deleted because it is in use.",
        });
      return res
        .status(500)
        .json({ message: "Error deleting fee category", error: error.message });
    }
  };

  createStructure = async (
    req: Request<unknown, unknown, CreateFeeStructure>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { dueDate, ...data } = req.body;
      // const parentsAreValid = await this.structureParentsBelongToSchool(data);
      // if (!parentsAreValid)
      //   return res.status(400).json({
      //     message:
      //       "academicYearId, classId, and feeCategoryId must belong to the specified schoolId.",
      //   });

      const structure = await prisma.feeStructure.create({
        data: {
          ...data,
          ...(dueDate !== undefined && {
            dueDate: dueDate ? new Date(dueDate) : null,
          }),
        },
      });
      return res.status(201).json({
        message: "Fee structure created successfully",
        data: structure,
      });
    } catch (error: any) {
      if (error.code === "P2003")
        return res
          .status(400)
          .json({ message: "Invalid fee structure relationship." });
      return res.status(500).json({
        message: "Error creating fee structure",
        error: error.message,
      });
    }
  };

  getStructures = async (
    req: Request<
      unknown,
      unknown,
      unknown,
      {
        schoolId?: string;
        academicYearId?: string;
        classId?: string;
        feeCategoryId?: string;
        isActive?: string;
      }
    >,
    res: Response,
  ): Promise<Response> => {
    try {
      const { schoolId, academicYearId, classId, feeCategoryId, isActive } =
        req.query;
      const structures = await prisma.feeStructure.findMany({
        where: {
          ...(schoolId !== undefined && { schoolId }),
          ...(academicYearId !== undefined && { academicYearId }),
          ...(classId !== undefined && { classId }),
          ...(feeCategoryId !== undefined && { feeCategoryId }),
          ...(isActive !== undefined && { isActive: isActive === "true" }),
        },
        include: { feeCategory: true, academicYear: true, class: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({
        message: "Fee structures retrieved successfully",
        data: structures,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving fee structures",
        error: error.message,
      });
    }
  };

  getStructureById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      const structure = await prisma.feeStructure.findUnique({
        where: { id: req.params.id },
        include: { feeCategory: true, academicYear: true, class: true },
      });
      if (!structure)
        return res.status(404).json({ message: "Fee structure not found" });
      return res.status(200).json({
        message: "Fee structure retrieved successfully",
        data: structure,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving fee structure",
        error: error.message,
      });
    }
  };

  updateStructure = async (
    req: Request<{ id: string }, unknown, UpdateFeeStructure>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { dueDate, ...data } = req.body;
      const existing = await prisma.feeStructure.findUnique({
        where: { id: req.params.id },
      });
      if (!existing)
        return res.status(404).json({ message: "Fee structure not found" });

      // const parentsAreValid = await this.structureParentsBelongToSchool({
      //   schoolId: existing.schoolId,
      //   academicYearId: data.academicYearId ?? existing.academicYearId,
      //   classId: data.classId ?? existing.classId,
      //   feeCategoryId: data.feeCategoryId ?? existing.feeCategoryId,
      // });
      // if (!parentsAreValid)
      //   return res.status(400).json({
      //     message:
      //       "academicYearId, classId, and feeCategoryId must belong to the fee structure's school.",
      //   });

      const structure = await prisma.feeStructure.update({
        where: { id: req.params.id },
        data: {
          ...data,
          ...(dueDate !== undefined && {
            dueDate: dueDate ? new Date(dueDate) : null,
          }),
        },
      });
      return res.status(200).json({
        message: "Fee structure updated successfully",
        data: structure,
      });
    } catch (error: any) {
      if (error.code === "P2025")
        return res.status(404).json({ message: "Fee structure not found" });
      if (error.code === "P2003")
        return res
          .status(400)
          .json({ message: "Invalid fee structure relationship." });
      return res.status(500).json({
        message: "Error updating fee structure",
        error: error.message,
      });
    }
  };

  deleteStructure = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    try {
      await prisma.feeStructure.delete({ where: { id: req.params.id } });
      return res
        .status(200)
        .json({ message: "Fee structure deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025")
        return res.status(404).json({ message: "Fee structure not found" });
      if (error.code === "P2003")
        return res.status(409).json({
          message: "Fee structure cannot be deleted because it is in use.",
        });
      return res.status(500).json({
        message: "Error deleting fee structure",
        error: error.message,
      });
    }
  };

  private async structureParentsBelongToSchool(
    data: Pick<
      CreateFeeStructure,
      "schoolId" | "academicYearId" | "classId" | "feeCategoryId"
    >,
  ): Promise<boolean> {
    const [academicYear, schoolClass, category] = await Promise.all([
      prisma.academicYear.findFirst({
        where: { id: data.academicYearId, schoolId: data.schoolId },
        select: { id: true },
      }),
      prisma.class.findFirst({
        where: { id: data.classId, schoolId: data.schoolId },
        select: { id: true },
      }),
      prisma.feeCategory.findFirst({
        where: { id: data.feeCategoryId, schoolId: data.schoolId },
        select: { id: true },
      }),
    ]);
    return Boolean(academicYear && schoolClass && category);
  }
}

export default FeeController;
