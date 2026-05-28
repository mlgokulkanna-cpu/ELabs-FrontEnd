import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import { sql } from "../db.js";

const { Pool } = pg;

dotenv.config({
  path: path.resolve(process.cwd(), "..", "server", ".env")
});

const router = express.Router();

let neonPool;
const getNeonPool = () => {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!neonPool) {
    neonPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  return neonPool;
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
};

const normalizeOrder = (row) => ({
  so: row.so,
  job: row.job,
  jobStatus: row.job_status,
  item: row.item,
  lineName: row.line_name,
  custPO: row.cust_po,
  custItemNum: row.cust_item_num,
  price: Number(row.price),
  qtyOrdered: Number(row.qty_ordered),
  qtyShipped: Number(row.qty_shipped),
  dueDate: formatDate(row.due_date),
  custReqDate: formatDate(row.cust_req_date),
  amNotes: row.am_notes ?? "",
  planNotes: row.plan_notes ?? "",
  rmStatus: row.rm_status ?? "",
  compStatus: row.comp_status ?? "",
  componentStatus: row.component_status ?? "",
  elabsMatStatus: row.elabs_mat_status ?? "",
  bulkJob: row.bulk_job ?? "",
  bulkLot: row.bulk_lot ?? "",
  projFillDate: formatDate(row.proj_fill_date),
  finishGoodLot: row.finish_good_lot ?? "",
  orderDate: formatDate(row.order_date),
  dateShipped: formatDate(row.date_shipped),
  internalProgress: row.internal_progress ?? "",
  progressStatus: row.progress_status ?? "",
  site: row.site ?? ""
});

router.get("/orders", async (req, res) => {
  try {
    const pool = getNeonPool();

    if (pool) {
      const result = await pool.query("SELECT * FROM orders ORDER BY id ASC");

      if (result.rows.length > 0) {
        const orders = result.rows.map(normalizeOrder);
        console.log(`Loaded ${orders.length} orders from NeonDB`);
        return res.json(orders);
      }
    }

    console.log("No NeonDB orders returned, using orders.json fallback");
    const file = path.resolve(process.cwd(), "..", "orders.json");
    const contents = fs.readFileSync(file, "utf8");
    const orders = contents ? JSON.parse(contents) : [];
    res.json(orders);
  } catch (error) {
    console.error("Failed to load orders:", error);

    try {
      const file = path.resolve(process.cwd(), "..", "orders.json");
      const contents = fs.readFileSync(file, "utf8");
      const orders = contents ? JSON.parse(contents) : [];
      return res.json(orders);
    } catch (fallbackError) {
      console.error("Fallback orders load failed:", fallbackError);
      return res.status(500).json({
        error: "Server error"
      });
    }
  }
});

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

// Accept lightweight order updates and persist to a JSON file (simple backend persistence)
router.post('/order-update', async (req, res) => {
  try {
    const update = req.body; // expect { so: string, amNotes?, planNotes?, rmStatus?, compStatus? }
    if (!update || !update.so) {
      return res.status(400).json({ error: 'Missing order identifier (so)' });
    }

    // write to a local JSON file as a simple persistence layer
    const fs = await import('fs');
    const path = await import('path');
    const file = path.resolve(process.cwd(), 'updates.json');
    console.log('order-update request', update, 'saving to', file);

    let current = {};
    if (fs.existsSync(file)) {
      try {
        const contents = fs.readFileSync(file, 'utf8');
        current = contents ? JSON.parse(contents) : {};
      } catch (e) {
        current = {};
      }
    }

    current[update.so] = { ...(current[update.so] || {}), ...update, updatedAt: new Date().toISOString() };

    fs.writeFileSync(file, JSON.stringify(current, null, 2), 'utf8');

    res.json({ ok: true, saved: current[update.so] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;