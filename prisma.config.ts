// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema/",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: process.env["DATABASE_URL"]!,
//   },
// });

// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema/",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
