import Express from "express";
import type { Request, Response } from "express";
const app = Express();

// Middlewares
app.use(Express.json()); 

// Routes

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});