import express from "express";
import { sql } from "../db.js";

const router = express.Router();

router.get("/master-data", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT TOP 100 *
      FROM dbo.master_data
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/agent-data", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT TOP 100 *
      FROM dbo.agent_generated_data
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;