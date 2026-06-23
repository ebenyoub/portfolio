import { RowDataPacket } from "mysql2";
import db from "../config/db.js";
import { User } from "../types/auth.type.js";

export const findByEmail = async (email: string): Promise<User | null> => {
    const sql = "select * from users where email = ?";
    const [rows] = await db.query<(User & RowDataPacket)[]>(sql, [email]);
    return rows[0] ?? null;
}