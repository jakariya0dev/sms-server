import { Router } from "express";
import StudentController from "./student.controller";

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.post("/", studentController.createStudent);
studentRouter.get("/", studentController.getStudents);
studentRouter.get("/:id", studentController.getStudentById);
studentRouter.patch("/:id", studentController.updateStudent);
studentRouter.delete("/:id", studentController.deleteStudent);

export default studentRouter;
