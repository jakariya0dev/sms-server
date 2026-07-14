import Express from "express";
import type { Request, Response } from "express";

// route imports
import studentRouter from "./modules/students/student.routes";

const app = Express();

// Middlewares
app.use(Express.json()); 



// Testing route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});


// Routes
app.use("/students", studentRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});