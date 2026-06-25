import { Router } from "express";
import db from "../config/db.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM medias ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { name, url, public_id } = req.body;
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO medias (name, url, public_id) VALUES (?, ?, ?)",
      [name, url, public_id || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, name, url, public_id } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM medias WHERE id = ?", [id]);
    res.json({ success: true, message: "Média supprimé" });
  } catch (error) {
    next(error);
  }
});

export default router;
