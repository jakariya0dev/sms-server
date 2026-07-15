import router from "express";
import SchoolController from "./school.controller";

const schoolRouter = router();
const schoolController = new SchoolController();

schoolRouter.post("/create", schoolController.createSchool);

export default schoolRouter;
