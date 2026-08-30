import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import sessionRoutes from "./routes/session.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authenticationRoutes);
app.use("/api/session", sessionRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "Zero Trust backend is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();