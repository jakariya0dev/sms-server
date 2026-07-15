import { Router } from "express";
import SchoolController from "./school.controller";

const schoolRouter = Router();
const schoolController = new SchoolController();

schoolRouter.post("/", schoolController.createSchool);
schoolRouter.get("/", schoolController.getSchools);
schoolRouter.get("/:id", schoolController.getSchoolById);
schoolRouter.patch("/:id", schoolController.updateSchool);
schoolRouter.delete("/:id", schoolController.deleteSchool);

export default schoolRouter;
