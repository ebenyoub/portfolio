-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--
--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `tech_stack` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `demo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `context` text COLLATE utf8mb4_unicode_ci,
  `objective` text COLLATE utf8mb4_unicode_ci,
  `learned_skills` json DEFAULT NULL,
  `technical_stack` json DEFAULT NULL,
  `code_snippets` json DEFAULT NULL,
  `challenges` text COLLATE utf8mb4_unicode_ci,
  `solution` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (12,'ArgentBank','Application web bancaire complète utilisant React pour le frontend et une API REST pour les données.','React, Redux, JWT, Swagger','https://github.com/ebenyoub/argentBank_app',NULL,'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800','2026-05-14 13:56:24','2026-05-14 14:34:57','Développement du front-end d\'une nouvelle banque en ligne. Le projet consistait à créer une application web complète et responsive utilisant React.','Mettre en place un système d\'authentification des utilisateurs, gérer le profil utilisateur de manière sécurisée et assurer la communication avec une API REST.','[\"React\", \"Redux ToolKit\", \"Authentification JWT\", \"Intégration d\'API\", \"Swagger\"]',NULL,NULL,'Gestion de l\'état global de l\'application avec Redux ToolKit (authentification, persistance de session). Sécurisation des accès via JWT et interaction avec une documentation Swagger.',NULL),(13,'Kasa','Plateforme de location de logements entre particuliers, développée avec React et SASS.','React, React Router, SASS','https://github.com/ebenyoub/Kasa','https://ebenyoub.github.io/Kasa/','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800','2026-05-14 13:56:24','2026-05-14 14:34:57','Création d\'une application de location de logements entre particuliers (type Airbnb).','Développer une interface utilisateur moderne avec React et React Router. Gérer l\'affichage dynamique des logements et de leurs caractéristiques.','[\"React Router\", \"SASS\", \"Rendu conditionnel\", \"Composants réutilisables\", \"Animations CSS\"]',NULL,NULL,'Implémentation de composants d\'interface complexes en pur React/CSS sans bibliothèques tierces (galerie d\'images, menus collapsibles).',NULL),(14,'SportSee','Dashboard analytique pour le coaching sportif, utilisant Recharts pour la visualisation de données.','React, Recharts, API REST','https://github.com/ebenyoub/sportSee_front','https://ebenyoub.github.io/sportSee_front/','https://images.unsplash.com/photo-1461896704190-3213c9ad81ae?auto=format&fit=crop&q=80&w=800','2026-05-14 13:56:24','2026-05-14 14:34:57','Développement d\'un tableau de bord analytique pour une application de coaching sportif haute performance.','Visualiser les données d\'activité physique des utilisateurs (sessions, calories, performance) via des graphiques interactifs.','[\"Data Visualization (Recharts)\", \"Data Modeling\", \"Fetch API\", \"React\", \"Standardisation de données\"]',NULL,NULL,'Consommation de données complexes provenant d\'endpoints API multiples. Intégration de Recharts et modélisation des données brutes.',NULL),(15,'OhMyFood','Site \"mobile-first\" de réservation de menus de restaurants gastronomiques avec animations CSS.','HTML, SASS, CSS Animations','https://github.com/ebenyoub/ocr_p3_ohmyfood','https://ebenyoub.github.io/ocr_p3_ohmyfood/','https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800','2026-05-14 13:56:24','2026-05-14 14:34:57','Création d\'un site \"mobile-first\" qui répertorie les menus de restaurants gastronomiques.','Réaliser une interface riche en animations CSS et garantir une expérience utilisateur fluide sur tous les appareils.','[\"SASS (Mixins, Variables, BEM)\", \"Animations CSS avancées\", \"Responsive Design\", \"Mobile-first\"]',NULL,NULL,'Implémentation d\'animations complexes (chargement initial, apparition progressive) en utilisant exclusivement SASS et CSS.',NULL),(16,'Petits Plats','Moteur de recherche de recettes de cuisine optimisé via des algorithmes JavaScript.','JavaScript, HTML, CSS','https://github.com/ebenyoub/petits_plats','https://ebenyoub.github.io/petits_plats/','https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800','2026-05-14 13:56:24','2026-05-14 14:34:57','Développement d\'un moteur de recherche de recettes de cuisine optimisé.','Créer une interface permettant de filtrer des recettes par ingrédients, appareils ou ustensiles avec une recherche instantanée.','[\"JavaScript ES6\", \"Algorithmique\", \"Optimisation de performance\", \"Manipulation du DOM\"]',NULL,NULL,'Implémentation et comparaison de deux versions d\'un algorithme de recherche pour déterminer la solution la plus performante.',NULL),(17,'Cub3d','Moteur de rendu 3D (Raycasting) développé en C, inspiré de Wolfenstein 3D.','C, MiniLibX, Raycasting','https://github.com/ebenyoub/cube3d',NULL,'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800','2026-05-14 14:29:44','2026-05-14 14:34:57','Création d\'un moteur de rendu 3D à la première personne à partir d\'une carte 2D définie par l\'utilisateur.','Développer un moteur de raycasting performant, gérer les textures, les sprites et les entrées utilisateur.','[\"Langage C\", \"Trigonométrie\", \"Algorithmique 3D\", \"Gestion de la mémoire\", \"MiniLibX\"]',NULL,NULL,'Utilisation de calculs mathématiques et trigonométriques complexes pour simuler la perspective et les collisions. Gestion du rendu graphique bas niveau.',NULL),(18,'Twitch Clone Next','Clone de l\'interface Twitch utilisant Next.js et Tailwind CSS.','Next.js, Tailwind CSS, TypeScript','https://github.com/ebenyoub/twitch_clone_next','https://ebenyoub.github.io/twitch_clone_next/','https://images.unsplash.com/photo-1527334134460-f21a05ef52a3?auto=format&fit=crop&q=80&w=800','2026-05-14 14:29:44','2026-05-14 14:34:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'Book List Redux','Gestionnaire de liste de livres avec React et Redux.','React, Redux, API','https://github.com/ebenyoub/book_list_redux','https://ebenyoub.github.io/book_list_redux/','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800','2026-05-14 14:29:44','2026-05-14 14:34:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

ALTER TABLE `projects`
  ADD COLUMN `gallery_images` json DEFAULT NULL AFTER `technical_stack`,
  ADD COLUMN `display_settings` json DEFAULT NULL AFTER `gallery_images`,
  ADD COLUMN `is_featured` tinyint(1) NOT NULL DEFAULT 0 AFTER `display_settings`,
  ADD COLUMN `featured_order` int NOT NULL DEFAULT 0 AFTER `is_featured`;

UPDATE `projects` SET
  `image_url` = '/project-images/kasa/screenshot-1.png',
  `gallery_images` = '["/project-images/kasa/screenshot-1.png", "/project-images/kasa/screenshot-2.png"]',
  `display_settings` = '{"show_cover":true,"show_gallery":true,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}'
WHERE `title` = 'Kasa';

UPDATE `projects` SET
  `image_url` = '/project-images/sportsee/screenshot-1.png',
  `gallery_images` = '["/project-images/sportsee/screenshot-1.png"]',
  `display_settings` = '{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}'
WHERE `title` = 'SportSee';

UPDATE `projects` SET
  `image_url` = '/project-images/ohmyfood/screenshot-1.png',
  `gallery_images` = '["/project-images/ohmyfood/screenshot-1.png"]',
  `display_settings` = '{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}'
WHERE `title` = 'OhMyFood';

UPDATE `projects` SET
  `image_url` = '/project-images/book-list-redux/screenshot-1.png',
  `gallery_images` = '["/project-images/book-list-redux/screenshot-1.png"]',
  `display_settings` = '{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}'
WHERE `title` = 'Book List Redux';

UPDATE `projects` SET
  `image_url` = '/project-images/cub3d/cub3d-1.png',
  `gallery_images` = '["/project-images/cub3d/cub3d-1.png", "/project-images/cub3d/cub3d-2.png", "/project-images/cub3d/cub3d-3.png", "/project-images/cub3d/cub3d-4.png"]',
  `display_settings` = '{"show_cover":true,"show_gallery":true,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}'
WHERE `title` = 'Cub3d';

UPDATE `projects` SET
  `is_featured` = 1,
  `featured_order` = 1
WHERE `title` = 'Kasa';

UPDATE `projects` SET
  `is_featured` = 1,
  `featured_order` = 2
WHERE `title` = 'SportSee';

UPDATE `projects` SET
  `is_featured` = 1,
  `featured_order` = 3
WHERE `title` = 'Cub3d';

-- BEGIN AUTO-GENERATED GITHUB PROJECT IMPORT
SET @project_id := (
  SELECT id FROM projects
  WHERE
    github_url = 'https://github.com/elyas-benyoub/retrospective_backend'
    OR LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '')) = 'retrospectivebackend'
  LIMIT 1
);

INSERT INTO projects (
  title,
  description,
  tech_stack,
  github_url,
  demo_url,
  image_url,
  context,
  objective,
  learned_skills,
  technical_stack,
  gallery_images,
  display_settings,
  challenges,
  solution
)
SELECT
  'Retrospective Backend',
  'API REST TypeScript pour une application de retrospective, avec authentification, gestion de profil, recuperation de mot de passe et sessions par code.',
  'TypeScript, Express, MySQL, JWT, Socket.IO, Nodemailer, Winston',
  'https://github.com/elyas-benyoub/retrospective_backend',
  NULL,
  '/project-images/github-project-placeholder.svg',
  'Backend d''une application de retrospective analyse a partir des routes Express, des controleurs d''authentification et des controleurs de session du depot.',
  'Fournir une API pour inscrire, connecter et authentifier les utilisateurs, gerer les profils et creer ou rejoindre des sessions de retrospective.',
  CAST('["API REST Express","Authentification JWT","MySQL2","Gestion de sessions","Envoi d''emails","Journalisation applicative"]' AS JSON),
  CAST('["TypeScript","Express","MySQL","JWT","Socket.IO","Nodemailer","Winston"]' AS JSON),
  CAST('[]' AS JSON),
  CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON),
  'Coordonner l''authentification, les sessions courtes par code, la persistance MySQL et les retours d''erreurs de l''API.',
  'Le serveur separe les routes d''authentification, les controleurs de session, le middleware JWT et les utilitaires de logs/email.'
WHERE @project_id IS NULL;

SET @project_id := COALESCE(@project_id, LAST_INSERT_ID());

UPDATE projects
SET
  description = COALESCE(description, 'API REST TypeScript pour une application de retrospective, avec authentification, gestion de profil, recuperation de mot de passe et sessions par code.'),
  tech_stack = COALESCE(tech_stack, 'TypeScript, Express, MySQL, JWT, Socket.IO, Nodemailer, Winston'),
  github_url = COALESCE(github_url, 'https://github.com/elyas-benyoub/retrospective_backend'),
  demo_url = COALESCE(demo_url, NULL),
  image_url = COALESCE(image_url, '/project-images/github-project-placeholder.svg'),
  context = COALESCE(context, 'Backend d''une application de retrospective analyse a partir des routes Express, des controleurs d''authentification et des controleurs de session du depot.'),
  objective = COALESCE(objective, 'Fournir une API pour inscrire, connecter et authentifier les utilisateurs, gerer les profils et creer ou rejoindre des sessions de retrospective.'),
  learned_skills = COALESCE(learned_skills, CAST('["API REST Express","Authentification JWT","MySQL2","Gestion de sessions","Envoi d''emails","Journalisation applicative"]' AS JSON)),
  technical_stack = COALESCE(technical_stack, CAST('["TypeScript","Express","MySQL","JWT","Socket.IO","Nodemailer","Winston"]' AS JSON)),
  gallery_images = COALESCE(gallery_images, CAST('[]' AS JSON)),
  display_settings = COALESCE(display_settings, CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON)),
  challenges = COALESCE(challenges, 'Coordonner l''authentification, les sessions courtes par code, la persistance MySQL et les retours d''erreurs de l''API.'),
  solution = COALESCE(solution, 'Le serveur separe les routes d''authentification, les controleurs de session, le middleware JWT et les utilitaires de logs/email.')
WHERE id = @project_id;

SET @project_id := (
  SELECT id FROM projects
  WHERE
    github_url = 'https://github.com/elyas-benyoub/retrospective_frontend'
    OR LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '')) = 'retrospectivefrontend'
  LIMIT 1
);

INSERT INTO projects (
  title,
  description,
  tech_stack,
  github_url,
  demo_url,
  image_url,
  context,
  objective,
  learned_skills,
  technical_stack,
  gallery_images,
  display_settings,
  challenges,
  solution
)
SELECT
  'Retrospective Frontend',
  'Frontend React/TypeScript pour une application de retrospective, avec pages d''authentification, profil et gestion de sessions.',
  'React, TypeScript, Vite, React Router, Tailwind CSS, Socket.IO Client, React Hook Form, Styled Components',
  'https://github.com/elyas-benyoub/retrospective_frontend',
  NULL,
  '/project-images/github-project-placeholder.svg',
  'Interface frontend associee au projet de retrospective, analysee a partir des routes React, pages d''authentification, contexte utilisateur et pages de session.',
  'Permettre aux utilisateurs de s''inscrire, se connecter, consulter leur profil et acceder aux sessions de retrospective.',
  CAST('["React Router","Context API","Formulaires React","Integration API","Interface TypeScript","Temps reel avec Socket.IO"]' AS JSON),
  CAST('["React","TypeScript","Vite","React Router","Tailwind CSS","Socket.IO Client","React Hook Form","Styled Components"]' AS JSON),
  CAST('[]' AS JSON),
  CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON),
  'Organiser les routes privees, l''etat d''authentification, les notifications et l''acces aux sessions depuis une interface React.',
  'Le frontend regroupe les providers d''authentification et de notifications autour d''un routage React avec pages dediees aux workflows utilisateur.'
WHERE @project_id IS NULL;

SET @project_id := COALESCE(@project_id, LAST_INSERT_ID());

UPDATE projects
SET
  description = COALESCE(description, 'Frontend React/TypeScript pour une application de retrospective, avec pages d''authentification, profil et gestion de sessions.'),
  tech_stack = COALESCE(tech_stack, 'React, TypeScript, Vite, React Router, Tailwind CSS, Socket.IO Client, React Hook Form, Styled Components'),
  github_url = COALESCE(github_url, 'https://github.com/elyas-benyoub/retrospective_frontend'),
  demo_url = COALESCE(demo_url, NULL),
  image_url = COALESCE(image_url, '/project-images/github-project-placeholder.svg'),
  context = COALESCE(context, 'Interface frontend associee au projet de retrospective, analysee a partir des routes React, pages d''authentification, contexte utilisateur et pages de session.'),
  objective = COALESCE(objective, 'Permettre aux utilisateurs de s''inscrire, se connecter, consulter leur profil et acceder aux sessions de retrospective.'),
  learned_skills = COALESCE(learned_skills, CAST('["React Router","Context API","Formulaires React","Integration API","Interface TypeScript","Temps reel avec Socket.IO"]' AS JSON)),
  technical_stack = COALESCE(technical_stack, CAST('["React","TypeScript","Vite","React Router","Tailwind CSS","Socket.IO Client","React Hook Form","Styled Components"]' AS JSON)),
  gallery_images = COALESCE(gallery_images, CAST('[]' AS JSON)),
  display_settings = COALESCE(display_settings, CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON)),
  challenges = COALESCE(challenges, 'Organiser les routes privees, l''etat d''authentification, les notifications et l''acces aux sessions depuis une interface React.'),
  solution = COALESCE(solution, 'Le frontend regroupe les providers d''authentification et de notifications autour d''un routage React avec pages dediees aux workflows utilisateur.')
WHERE id = @project_id;

SET @project_id := (
  SELECT id FROM projects
  WHERE
    github_url = 'https://github.com/elyas-benyoub/booking_room'
    OR LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '')) = 'bookingroom'
  LIMIT 1
);

INSERT INTO projects (
  title,
  description,
  tech_stack,
  github_url,
  demo_url,
  image_url,
  context,
  objective,
  learned_skills,
  technical_stack,
  gallery_images,
  display_settings,
  challenges,
  solution
)
SELECT
  'Booking Room',
  'Application de reservation de salles avec frontend React/TypeScript et backend PHP organise autour de controleurs, modeles et routeur dynamique.',
  'React, TypeScript, Vite, PHP, React Router, Tailwind CSS, Zod',
  'https://github.com/elyas-benyoub/booking_room',
  NULL,
  '/project-images/github-project-placeholder.svg',
  'Projet full-stack analyse a partir du frontend React, du routeur PHP et des controleurs utilisateur, salle et reservation.',
  'Proposer une interface de consultation et de gestion de reservation avec une API PHP cote serveur.',
  CAST('["React Router","Validation Zod","API PHP","Architecture MVC simple","Routing backend","Separation frontend/backend"]' AS JSON),
  CAST('["React","TypeScript","Vite","PHP","React Router","Tailwind CSS","Zod"]' AS JSON),
  CAST('[]' AS JSON),
  CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON),
  'Faire cohabiter un frontend Vite et une API PHP locale avec des routes et modeles dedies.',
  'Le projet separe les pages React, les composants UI et un backend PHP avec routeur dynamique, controleurs et modeles.'
WHERE @project_id IS NULL;

SET @project_id := COALESCE(@project_id, LAST_INSERT_ID());

UPDATE projects
SET
  description = COALESCE(description, 'Application de reservation de salles avec frontend React/TypeScript et backend PHP organise autour de controleurs, modeles et routeur dynamique.'),
  tech_stack = COALESCE(tech_stack, 'React, TypeScript, Vite, PHP, React Router, Tailwind CSS, Zod'),
  github_url = COALESCE(github_url, 'https://github.com/elyas-benyoub/booking_room'),
  demo_url = COALESCE(demo_url, NULL),
  image_url = COALESCE(image_url, '/project-images/github-project-placeholder.svg'),
  context = COALESCE(context, 'Projet full-stack analyse a partir du frontend React, du routeur PHP et des controleurs utilisateur, salle et reservation.'),
  objective = COALESCE(objective, 'Proposer une interface de consultation et de gestion de reservation avec une API PHP cote serveur.'),
  learned_skills = COALESCE(learned_skills, CAST('["React Router","Validation Zod","API PHP","Architecture MVC simple","Routing backend","Separation frontend/backend"]' AS JSON)),
  technical_stack = COALESCE(technical_stack, CAST('["React","TypeScript","Vite","PHP","React Router","Tailwind CSS","Zod"]' AS JSON)),
  gallery_images = COALESCE(gallery_images, CAST('[]' AS JSON)),
  display_settings = COALESCE(display_settings, CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON)),
  challenges = COALESCE(challenges, 'Faire cohabiter un frontend Vite et une API PHP locale avec des routes et modeles dedies.'),
  solution = COALESCE(solution, 'Le projet separe les pages React, les composants UI et un backend PHP avec routeur dynamique, controleurs et modeles.')
WHERE id = @project_id;

SET @project_id := (
  SELECT id FROM projects
  WHERE
    github_url = 'https://github.com/elyas-benyoub/atelier_dein'
    OR LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '')) = 'atelierdein'
  LIMIT 1
);

INSERT INTO projects (
  title,
  description,
  tech_stack,
  github_url,
  demo_url,
  image_url,
  context,
  objective,
  learned_skills,
  technical_stack,
  gallery_images,
  display_settings,
  challenges,
  solution
)
SELECT
  'Atelier Dein',
  'Application PHP MVC de gestion de medias, utilisateurs et emprunts, avec espace d''administration et base MySQL.',
  'PHP, MySQL, MVC, PDO, HTML, CSS, JavaScript',
  'https://github.com/elyas-benyoub/atelier_dein',
  NULL,
  '/project-images/github-project-placeholder.svg',
  'Application PHP analysee a partir des controleurs admin/media/emprunt, des modeles, du routeur et des scripts SQL de medias.',
  'Gerer un catalogue de livres, films et jeux, les utilisateurs, les genres et les emprunts de medias.',
  CAST('["Architecture MVC","Routing PHP","PDO/MySQL","Authentification","CRUD admin","Gestion d''uploads"]' AS JSON),
  CAST('["PHP","MySQL","MVC","PDO","HTML","CSS","JavaScript"]' AS JSON),
  CAST('[]' AS JSON),
  CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON),
  'Structurer une application PHP avec plusieurs entites metier, droits d''administration, emprunts et relations de genres.',
  'Le code organise les responsabilites en controleurs, modeles, vues, helpers et scripts SQL d''initialisation.'
WHERE @project_id IS NULL;

SET @project_id := COALESCE(@project_id, LAST_INSERT_ID());

UPDATE projects
SET
  description = COALESCE(description, 'Application PHP MVC de gestion de medias, utilisateurs et emprunts, avec espace d''administration et base MySQL.'),
  tech_stack = COALESCE(tech_stack, 'PHP, MySQL, MVC, PDO, HTML, CSS, JavaScript'),
  github_url = COALESCE(github_url, 'https://github.com/elyas-benyoub/atelier_dein'),
  demo_url = COALESCE(demo_url, NULL),
  image_url = COALESCE(image_url, '/project-images/github-project-placeholder.svg'),
  context = COALESCE(context, 'Application PHP analysee a partir des controleurs admin/media/emprunt, des modeles, du routeur et des scripts SQL de medias.'),
  objective = COALESCE(objective, 'Gerer un catalogue de livres, films et jeux, les utilisateurs, les genres et les emprunts de medias.'),
  learned_skills = COALESCE(learned_skills, CAST('["Architecture MVC","Routing PHP","PDO/MySQL","Authentification","CRUD admin","Gestion d''uploads"]' AS JSON)),
  technical_stack = COALESCE(technical_stack, CAST('["PHP","MySQL","MVC","PDO","HTML","CSS","JavaScript"]' AS JSON)),
  gallery_images = COALESCE(gallery_images, CAST('[]' AS JSON)),
  display_settings = COALESCE(display_settings, CAST('{"show_cover":true,"show_gallery":false,"show_presentation":true,"show_context":true,"show_objective":true,"show_challenges":true,"show_solution":true,"show_learned_skills":true}' AS JSON)),
  challenges = COALESCE(challenges, 'Structurer une application PHP avec plusieurs entites metier, droits d''administration, emprunts et relations de genres.'),
  solution = COALESCE(solution, 'Le code organise les responsabilites en controleurs, modeles, vues, helpers et scripts SQL d''initialisation.')
WHERE id = @project_id;
-- END AUTO-GENERATED GITHUB PROJECT IMPORT

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@portfolio.fr','$2b$10$I98Of5W6J8QLcvZ34tQsR.43g6lAazOcJ4VRTQIvdjjcPjrQmCXJK','admin','2026-05-05 20:54:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-15 16:48:57
