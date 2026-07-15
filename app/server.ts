import app from "./app";
import { connectToDatabase, disconnectFromDatabase } from "./lib/dbConnection";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

bootstrap();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  await disconnectFromDatabase();
  process.exit(0);
});
