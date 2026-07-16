import { Router } from "express";
import FeeController from "./fee.controller";

const feeRouter = Router();
const feeController = new FeeController();

// categories routes
feeRouter.post("/categories", feeController.createCategory);
feeRouter.get("/categories", feeController.getCategories);
feeRouter.get("/categories/:id", feeController.getCategoryById);
feeRouter.patch("/categories/:id", feeController.updateCategory);
feeRouter.delete("/categories/:id", feeController.deleteCategory);

// structures routes
feeRouter.post("/structures", feeController.createStructure);
feeRouter.get("/structures", feeController.getStructures);
feeRouter.get("/structures/:id", feeController.getStructureById);
feeRouter.patch("/structures/:id", feeController.updateStructure);
feeRouter.delete("/structures/:id", feeController.deleteStructure);

export default feeRouter;
