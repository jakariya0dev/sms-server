import Express from "express";
import "dotenv/config";
import type { Request, Response } from "express";

// route imports
import studentRouter from "./modules/students/student.routes";
import schoolRouter from "./modules/schools/school.route";
import academicYearRouter from "./modules/academic-year/academicYear.route";

const app = Express();

// Middlewares
app.use(Express.json());

// Testing route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Routes
app.use("/students", studentRouter);
app.use("/schools", schoolRouter);
app.use("/academic-year", academicYearRouter);

export default app;
