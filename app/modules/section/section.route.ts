import { Router } from "express";
import SectionController from "./section.controller";

const sectionRouter = Router();
const sectionController = new SectionController();

sectionRouter.post("/", sectionController.createSection);
sectionRouter.get("/", sectionController.getSections);
sectionRouter.get("/:id", sectionController.getSectionById);
sectionRouter.patch("/:id", sectionController.updateSection);
sectionRouter.delete("/:id", sectionController.deleteSection);

export default sectionRouter;
