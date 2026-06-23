import { RowDataPacket } from "mysql2";
import db from "./db.js";

const columnExists = async (columnName: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SHOW COLUMNS FROM projects LIKE ?",
    [columnName]
  );

  return rows.length > 0;
};

const addColumnIfMissing = async (columnName: string, sql: string) => {
  if (await columnExists(columnName)) return;
  await db.query(sql);
};

const wait = (duration: number) => new Promise((resolve) => {
  setTimeout(resolve, duration);
});

export const ensureProjectCmsSchema = async () => {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await addColumnIfMissing(
        "gallery_images",
        "ALTER TABLE projects ADD COLUMN gallery_images JSON DEFAULT NULL AFTER technical_stack"
      );

      await addColumnIfMissing(
        "display_settings",
        "ALTER TABLE projects ADD COLUMN display_settings JSON DEFAULT NULL AFTER gallery_images"
      );

      await addColumnIfMissing(
        "is_featured",
        "ALTER TABLE projects ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER display_settings"
      );

      await addColumnIfMissing(
        "featured_order",
        "ALTER TABLE projects ADD COLUMN featured_order INT NOT NULL DEFAULT 0 AFTER is_featured"
      );

      return;
    } catch (error) {
      if (attempt === 10) throw error;
      await wait(1000);
    }
  }
};
