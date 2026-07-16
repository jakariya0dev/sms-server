import { Router } from "express";
import TeacherController from "./teacher.controller";

const teacherRouter = Router();
const teacherController = new TeacherController();

teacherRouter.post("/", teacherController.createTeacher);
teacherRouter.get("/", teacherController.getTeachers);
teacherRouter.get("/:id", teacherController.getTeacherById);
teacherRouter.patch("/:id", teacherController.updateTeacher);
teacherRouter.delete("/:id", teacherController.deleteTeacher);

export default teacherRouter;
