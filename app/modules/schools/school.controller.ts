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
}

export default SchoolController;
