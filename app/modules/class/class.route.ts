import { Router } from "express";
import ClassController from "./class.controller";

const classRouter = Router();
const classController = new ClassController();

classRouter.post("/", classController.createClass);
classRouter.get("/", classController.getClasses);
classRouter.get("/:id", classController.getClassById);
classRouter.patch("/:id", classController.updateClass);
classRouter.delete("/:id", classController.deleteClass);

export default classRouter;
