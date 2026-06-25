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

      // Create new tables for parcours, competences, parametres and medias
      await db.query(`
        CREATE TABLE IF NOT EXISTS \`parcours\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`year\` varchar(50) NOT NULL,
          \`title\` varchar(150) NOT NULL,
          \`subtitle\` varchar(150) DEFAULT NULL,
          \`description\` text,
          \`badge\` varchar(50) DEFAULT NULL,
          \`current\` tinyint(1) NOT NULL DEFAULT 0,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS \`competences\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`category\` varchar(50) NOT NULL,
          \`level\` int NOT NULL DEFAULT 100,
          \`display_order\` int NOT NULL DEFAULT 0,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS \`parametres\` (
          \`param_key\` varchar(100) NOT NULL,
          \`param_value\` text,
          PRIMARY KEY (\`param_key\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS \`medias\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`url\` varchar(500) NOT NULL,
          \`public_id\` varchar(255) DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Prefill parametres if empty
      const [paramRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM parametres");
      if (paramRows[0] && paramRows[0].count === 0) {
        const defaultParams = [
          ['name', 'Elyas Benyoub'],
          ['title', 'Développeur Web React & Full-Stack'],
          ['location', 'Lyon, France'],
          ['email', 'embenyoub@gmail.com'],
          ['github_url', 'https://github.com/ebenyoub'],
          ['linkedin_url', 'https://linkedin.com/in/elyas-benyoub'],
          ['bio_recruiter', 'Conception d\'applications web robustes, scalables et centrées sur l\'expérience utilisateur. Admis à l\'ESGI Lyon en Bachelor 3 Ingénierie du Web, je recherche une alternance pour relever vos défis techniques et intégrer vos équipes de développement.']
        ];
        for (const [key, val] of defaultParams) {
          await db.query("INSERT INTO parametres (param_key, param_value) VALUES (?, ?)", [key, val]);
        }
      }

      // Prefill parcours if empty
      const [parcoursRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM parcours");
      if (parcoursRows[0] && parcoursRows[0].count === 0) {
        const defaultParcours = [
          ['2025', 'ESGI — Bachelor 3', 'Ingénierie du Web', 'Admission en Bachelor 3 — approfondissement architecture web, DevOps avancé, microservices et développement full-stack en alternance.', 'En cours', 1],
          ['2023–2024', 'La Plateforme', 'Développeur Web et Web Mobile', 'Formation full-stack intensive : React, Node.js, PHP, MySQL, Docker. Projets en équipe avec méthodologie agile, Git flow et code reviews.', 'Diplôme', 0],
          ['2022', 'OpenClassrooms', 'Intégrateur Web', 'Développement front-end, intégration HTML/CSS avancée, accessibilité WCAG, responsive design et optimisation des performances.', 'Diplôme', 0],
          ['2021', 'École 42', 'Formation en C & Algorithmique', 'Apprentissage par les pairs, projets bas niveau (gestion mémoire, algorithmes de tri, parseurs), programmation système et graphique.', 'Formation', 0]
        ];
        for (const [yr, tit, subt, desc, bdg, curr] of defaultParcours) {
          await db.query("INSERT INTO parcours (year, title, subtitle, description, badge, current) VALUES (?, ?, ?, ?, ?, ?)", [yr, tit, subt, desc, bdg, curr]);
        }
      }

      // Prefill competences if empty
      const [compRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM competences");
      if (compRows[0] && compRows[0].count === 0) {
        const defaultComps = [
          ['React', 'Frontend', 90, 1],
          ['TypeScript', 'Frontend', 85, 2],
          ['Next.js', 'Frontend', 75, 3],
          ['Tailwind CSS', 'Frontend', 90, 4],
          ['Node.js', 'Backend', 80, 5],
          ['Express', 'Backend', 85, 6],
          ['PHP', 'Backend', 70, 7],
          ['MySQL', 'Base de données', 80, 8],
          ['SQL', 'Base de données', 80, 9],
          ['Docker', 'DevOps', 75, 10],
          ['Git', 'DevOps', 85, 11]
        ];
        for (const [nm, cat, lvl, ord] of defaultComps) {
          await db.query("INSERT INTO competences (name, category, level, display_order) VALUES (?, ?, ?, ?)", [nm, cat, lvl, ord]);
        }
      }

      return;
    } catch (error) {
      if (attempt === 10) throw error;
      await wait(1000);
    }
  }
};
