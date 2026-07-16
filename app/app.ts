import Express from "express";
import "dotenv/config";
import type { Request, Response } from "express";

// route imports
import studentRouter from "./modules/student/student.routes";
import schoolRouter from "./modules/school/school.route";
import academicYearRouter from "./modules/academic-year/academicYear.route";
import classRouter from "./modules/class/class.route";
import sectionRouter from "./modules/section/section.route";
import teacherRouter from "./modules/teacher/teacher.route";
import feeRouter from "./modules/fee/fee.route";

const app = Express();

// Middlewares
app.use(Express.json());

// Testing route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Running...");
});

// Routes
app.use("/students", studentRouter);
app.use("/schools", schoolRouter);
app.use("/academic-year", academicYearRouter);
app.use("/classes", classRouter);
app.use("/sections", sectionRouter);
app.use("/teachers", teacherRouter);
app.use("/fees", feeRouter);

export default app;
