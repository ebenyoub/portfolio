# PROJECT_STATE.md

## Description du Projet
Portfolio professionnel d'Elyas Benyoub pour décrocher une alternance ESGI Bachelor 3 Ingénierie du Web et servir de démonstration technique premium auprès des recruteurs.

---

## État des Modules

### 1. État Docker
* **Base de données (`db`)** : Conteneur MySQL 8.0 opérationnel et persistant. Point d'entrée `init.sql` exécuté correctement. Port 3308 lié à `127.0.0.1` en local pour éviter toute exposition publique.
* **Backend** : Conteneur Node.js 20 opérationnel (port `3001`).
* **Frontend** : En production, le front du portfolio est désormais servi directement par Nginx depuis `/var/www/portfolio`. Le conteneur frontend Docker n'est plus le chemin cible pour la production. En local, le front continue de fonctionner via Vite (`npm run dev`).
* **Sécurité & Production** : Fichier `docker-compose.prod.yml` en place pour retirer l'exposition de ports de MySQL en production. Les secrets de la base de données sont isolés dans `.env.mysql` pour éviter d'exposer les secrets applicatifs (JWT, Cloudinary, Mail) au conteneur MySQL.
* **CORS** : Les origines backend sont configurées par `CORS_ORIGIN` dans `portfolio_backend/.env`, sous forme de liste séparée par des virgules. Cette même variable est injectée par les compositions Docker de développement et de production.

### 2. État Cloudinary
* Opérationnel côté frontend. Intégration de l'upload d'images sans signature (unsigned preset) via les variables d'environnement configurées dans le `.env` du frontend.
* Sécurité assurée : aucune clé secrète Cloudinary (`CLOUDINARY_API_SECRET`) n'est embarquée côté frontend.

### 3. État CMS
* Espace d'administration fonctionnel accessible sur `/admin`.
* Permet la création, modification, suppression de projets, ainsi que la configuration des carousels (sélection des projets mis en avant `is_featured` et ordre `featured_order`).
* **Layout Admin** : Le composant `AdminLayout.tsx` enveloppe désormais l'ensemble des routes admin (Dashboard, Projets, Nouveau projet, Édition). Il implémente une navigation latérale sombre repliable fidèle au design Figma Make, avec un conteneur de contenu plus large et des pages de secours "En cours de développement" pour les autres modules (Parcours, Compétences, Médias, Paramètres).
* **Dashboard Admin** : Le composant `AdminDashboardPage.tsx` gère l'affichage à l'adresse `/admin/dashboard` (avec redirection automatique depuis `/admin`), et propose des KPIs dynamiques (nombre de projets, compétences extraites, médias liés, étapes du parcours), un flux d'activité récente dynamique basé sur les projets et des raccourcis d'accès rapide.
* **Admin Projets** : La page `/admin/projects` est présentée comme une vue SaaS sombre premium avec carte d'en-tête, recherche locale, métriques de catalogue, liste de projets dense, miniatures, stacks, statut, date et actions icônes. La logique CRUD reste inchangée.

### 4. État GitHub Import
* Présence d'un script d'initialisation et d'import automatique dans `db/init.sql` pour charger directement les métadonnées de projets issus des dépôts GitHub publics d'Elyas Benyoub.

### 5. État Screenshots
* Les captures d'écran des projets sont hébergées sur Cloudinary. Les chemins relatifs historiques locaux d'images (ex: `/project-images/...`) sont résolus via un utilitaire de secours frontend.

### 6. État Figma Make
* **Statut** : Complètement intégré. Alignement visuel effectué (PB-004 Phase 2). La lisibilité des cartes Stack a été optimisée (PB-004 Phase 3). L'alignement de la page de gestion des projets admin (PB-006), des formulaires de création/édition de projet (PB-007) et du Dashboard Admin (PB-008) avec Figma Make a été entièrement réalisé. La reprise ciblée de `/admin/projects` a renforcé cette cohérence avec une vue sombre premium type SaaS, une recherche locale et une hiérarchie plus dense. Les pages de l'admin adoptent désormais une structure sombre et premium (`#111111`, `#0A0A0A` pour les champs/tables/listes, bordures `#262626`), des textareas stylisés, des KPI Cards haut de gamme, et des activités récentes bien hiérarchisées.

### 7. État des Tests
* **Backend (Vitest)** :
  * Middleware JWT (`auth.middleware.test.ts`) : Validation du contrôle d'accès.
  * API CRUD Projets (`project.integration.test.ts`) : 15 tests d'intégration HTTP (via Supertest) couvrant le succès, les ressources introuvables, les accès non autorisés (401/403) et la validation invalide (400) pour `GET`, `POST`, `PUT` et `DELETE`. La commande Vitest cible `src` pour exclure les copies compilées dans `dist`.
  * Configuration CORS (`cors.config.test.ts`) : 3 tests vérifiant le parsing des origines, l'autorisation d'une origine configurée et l'absence d'en-tête CORS pour une origine non autorisée.
* **Frontend (Vitest)** :
  * Sécurité (`PrivateRoute.test.tsx`) : Validation de l'accès aux pages d'administration.
  * Pages Projets (`ProjectsIntegration.test.tsx`) : 8 tests d'intégration de `ProjectsPage` et `ProjectDetailPage` vérifiant l'affichage de la liste et des détails, les états de chargement, les erreurs, la navigation de galerie et son état vide.
  * Cloudinary (`cloudinary.test.ts`, `ProjectForm.test.tsx`) : Mock réseau de l'upload, contrôle de l'URL sécurisée retournée, erreur de l'API et état de chargement du formulaire.
  * Carousels (`FeaturedProjectsCarousel.test.tsx`, `ProjectsIntegration.test.tsx`) : Sélection et ordre des projets mis en avant, navigation suivante/précédente, état vide, galerie de détail, changement d'image active et galerie sans image.
  * Accessibilité (`Accessibility.test.tsx`) : Régressions sur le nom accessible de la modale d'image, les contrôles de carousel et les erreurs de galerie annoncées aux lecteurs d'écran.
* **CI Locale** : Intégration dans le processus `make validate` qui vérifie le linting, le build et exécute les tests unitaires/d'intégration de tout le projet.

### 8. État Déploiement / CI-CD
* **Architecture VPS Portfolio** : Nginx sert le front depuis `/var/www/portfolio` et proxyfie `/api/` vers le backend Docker.
* **CI/CD Portfolio** : GitHub Actions exécute `npm ci`, `npm run lint`, `npm test`, `npm run build`, puis synchronise `dist/` vers `/var/www/portfolio` via `rsync`.
* **Cloudinary** : Le support des GIF est activé et le preset local utilisé est `portfolio_upload`.
* **Galeries projets** : Le fallback local Cub3D ne doit plus réinjecter automatiquement les images supprimées en administration.
* **Prochaine priorité infra** : appliquer la même stratégie de déploiement à La Loge.

---

## Points d'attention
* `FeaturedProjectsCarousel` est couvert par les tests, mais n'est pas encore rendu par `HomePage`. Son raccordement devra respecter l'alignement Figma Make dans un ticket dédié.

---

## Prochaine tâche recommandée
* **Migration La Loge vers architecture de production simplifiée**
  * Servir le front La Loge depuis `/var/www/la-loge`.
  * Garder backend et base de données en Docker.
  * Configurer Nginx en reverse proxy.
  * Ajouter un workflow GitHub Actions pour déployer le front automatiquement.
