import { Router } from "express";
import db from "../config/db.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

// GET all
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM parcours ORDER BY year DESC, id DESC");
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// POST new
router.post("/", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { year, title, subtitle, description, badge, current } = req.body;
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO parcours (year, title, subtitle, description, badge, current) VALUES (?, ?, ?, ?, ?, ?)",
      [year, title, subtitle || null, description || null, badge || null, current ? 1 : 0]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, year, title, subtitle, description, badge, current: !!current } });
  } catch (error) {
    next(error);
  }
});

// PUT update
router.put("/:id", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { year, title, subtitle, description, badge, current } = req.body;
    await db.query(
      "UPDATE parcours SET year = ?, title = ?, subtitle = ?, description = ?, badge = ?, current = ? WHERE id = ?",
      [year, title, subtitle || null, description || null, badge || null, current ? 1 : 0, id]
    );
    res.json({ success: true, message: "Parcours mis à jour" });
  } catch (error) {
    next(error);
  }
});

// DELETE
router.delete("/:id", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM parcours WHERE id = ?", [id]);
    res.json({ success: true, message: "Parcours supprimé" });
  } catch (error) {
    next(error);
  }
});

export default router;
