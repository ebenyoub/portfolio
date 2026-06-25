import { Router } from "express";
import db from "../config/db.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM parametres");
    const params: Record<string, string> = {};
    rows.forEach((row) => {
      params[row.param_key] = row.param_value;
    });
    res.json({ success: true, data: params });
  } catch (error) {
    next(error);
  }
});

router.put("/", authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const body = req.body;
    for (const [key, value] of Object.entries(body)) {
      await db.query(
        "INSERT INTO parametres (param_key, param_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE param_value = ?",
        [key, value, value]
      );
    }
    res.json({ success: true, message: "Paramètres mis à jour" });
  } catch (error) {
    next(error);
  }
});

export default router;
