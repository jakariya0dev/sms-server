// {
//   "name": "Dhaka International Ideal School",
//   "shortName": "DIIS",
//   "subdomain": "diis",
//   "email": "info@diis.edu.bd",
//   "phone": "+88029876543",
//   "website": "https://www.diis.edu.bd",
//   "registrationNo": "REG-2026-88741",
//   "eiin": "134567",
//   "logoUrl": "https://example.com/assets/images/diis-logo.png",
//   "faviconUrl": "https://example.com/assets/images/diis-favicon.ico",
//   "primaryColor": "#1E40AF",
//   "secondaryColor": "#0f766e",
//   "addressLine1": "House 45, Road 12, Sector 4",
//   "addressLine2": "Uttara Model Town",
//   "upazila": "Uttara",
//   "district": "Dhaka"
// }
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

interface UpdateSchool {
  name?: string;
  shortName?: string | null;
  subdomain?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  registrationNo?: string | null;
  eiin?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  upazila?: string | null;
  district?: string | null;
}

class SchoolController {
  async createSchool(req: Request, res: Response) {
    try {
      const {
        name,
        shortName,
        subdomain,
        email,
        phone,
        website,
        registrationNo,
        eiin,
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        addressLine1,
        addressLine2,
        upazila,
        district,
      } = req.body;

      const newSchool = await prisma.school.create({
        data: {
          name,
          shortName,
          subdomain,
          email,
          phone,
          website,
          registrationNo,
          eiin,
          logoUrl,
          faviconUrl,
          primaryColor,
          secondaryColor,
          addressLine1,
          addressLine2,
          upazila,
          district,
        },
      });
      res.status(201).json(newSchool);
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getSchools(_req: Request, res: Response): Promise<Response> {
    try {
      const schools = await prisma.school.findMany({
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        message: "Schools retrieved successfully",
        data: schools,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving schools",
        error: error.message,
      });
    }
  }

  async getSchoolById(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const school = await prisma.school.findUnique({
        where: { id: req.params.id },
      });

      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      return res.status(200).json({
        message: "School retrieved successfully",
        data: school,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error retrieving school",
        error: error.message,
      });
    }
  }

  async updateSchool(
    req: Request<{ id: string }, unknown, UpdateSchool>,
    res: Response,
  ): Promise<Response> {
    try {
      const school = await prisma.school.update({
        where: { id: req.params.id },
        data: req.body,
      });

      return res.status(200).json({
        message: "School updated successfully",
        data: school,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "School not found" });
      }

      return res.status(500).json({
        message: "Error updating school",
        error: error.message,
      });
    }
  }

  async deleteSchool(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      await prisma.school.delete({ where: { id: req.params.id } });

      return res.status(200).json({
        message: "School deleted successfully",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "School not found" });
      }

      if (error.code === "P2003") {
        return res.status(409).json({
          message: "School cannot be deleted because it is in use.",
        });
      }

      return res.status(500).json({
        message: "Error deleting school",
        error: error.message,
      });
    }
  }
}

export default SchoolController;
