import { Router } from "express";
import db from "../config/db.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM competences ORDER BY category, display_order, id");
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { name, category, level, display_order } = req.body;
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO competences (name, category, level, display_order) VALUES (?, ?, ?, ?)",
      [name, category, level ?? 100, display_order ?? 0]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, name, category, level, display_order } });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, level, display_order } = req.body;
    await db.query(
      "UPDATE competences SET name = ?, category = ?, level = ?, display_order = ? WHERE id = ?",
      [name, category, level ?? 100, display_order ?? 0, id]
    );
    res.json({ success: true, message: "Compétence mise à jour" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM competences WHERE id = ?", [id]);
    res.json({ success: true, message: "Compétence supprimée" });
  } catch (error) {
    next(error);
  }
});

export default router;
