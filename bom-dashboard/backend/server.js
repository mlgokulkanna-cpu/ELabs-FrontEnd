import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { getConnection } from "./db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
dotenv.config({
  path: path.resolve(process.cwd(), "..", "server", ".env")
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", dashboardRoutes);

getConnection().catch((err) => {
  console.log("DB connection failed, continuing without DB:", err?.message ?? err);
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});