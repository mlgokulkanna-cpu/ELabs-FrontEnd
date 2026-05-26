import express from "express";
import { sql, getConnection } from "../db.js";

const router = express.Router();

router.get("/master-data", async (req, res) => {

  try {

    const result = await sql.query(`
      SELECT
        unique_id,
        company_name,
        fg_description,
        client_sku_number,
        elabs_fg_match_code,
        fill_weight,
        formula_number,
        CAST(valid_from AS DATE) AS valid_from
      FROM dbo.master_data
      ORDER BY unique_id DESC
    `);

    res.json(result.recordset);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.get("/master-data/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const request = new sql.Request();

    request.input("id", sql.Int, id);

    const result = await request.query(`
      SELECT TOP 1
        unique_id,
        company_name,
        fg_description,
        client_sku_number,
        elabs_fg_match_code,
        fill_weight,
        formula_number,
        CAST(valid_from AS DATE) AS valid_from
      FROM dbo.master_data
      WHERE unique_id = @id
    `);

    res.json(result.recordset[0] || null);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.get("/agent-data/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const request = new sql.Request();

    request.input("id", sql.Int, id);

    const result = await request.query(`
      SELECT TOP 1 *
      FROM dbo.agent_generated_data
      WHERE source_unique_id = @id
    `);

    res.json(result.recordset[0] || null);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

export default router;