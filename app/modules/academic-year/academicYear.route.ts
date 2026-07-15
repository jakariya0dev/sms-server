import { Router } from "express";
import AcademicYearController from "./academicYear.controller";

const academicYearController = new AcademicYearController();
const academicYearRouter = Router();

academicYearRouter.post("/create", academicYearController.createAcademicYear);
academicYearRouter.patch("/:id", academicYearController.updateAcademicYear);
academicYearRouter.get("/", academicYearController.getAcademicYears);
academicYearRouter.get("/:id", academicYearController.getAcademicYearById);
academicYearRouter.delete("/:id", academicYearController.deleteAcademicYear);

export default academicYearRouter;
