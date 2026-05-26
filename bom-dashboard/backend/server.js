import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", dashboardRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});