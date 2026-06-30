# PRODUCT_BACKLOG.md

# Product Backlog

Ce document liste et priorise les prochaines interventions à effectuer sur le Portfolio pour le préparer à la mise en production.

---

## Priorités de classification
* **P0** : Bloquant (Empêche le build, l'exécution ou le déploiement de l'application)
* **P1** : Important (Impacte fortement les performances de production, la sécurité ou l'expérience recruteur)
* **P2** : Amélioration (Ajouts fonctionnels non critiques, optimisation de code)
* **P3** : Confort (Outillage développeur, raccourcis et scripts locaux)

---

### [P0] PB-001 : Correction et optimisation Docker pour la Production (Terminé)
* **Description** :
  1. Corriger l'erreur syntaxique dans le `Dockerfile` frontend.
  2. Build multi-stage compilant le frontend et servant via un serveur Nginx sécurisé.
* **Statut** : Terminé.

### [P1] PB-002 : Sécurisation Docker & Secrets MySQL (Terminé)
* **Description** :
  1. Exposer MySQL localement sur `127.0.0.1:3308` pour éviter une exposition publique.
  2. Séparer l'usage prod avec `docker-compose.prod.yml` (pas de ports exposés pour la db).
  3. Isoler les secrets db de l'application dans `.env.mysql`.
* **Statut** : Terminé.

### [P1] PB-004 : Alignement Figma Make (HomePage & Outils) (Terminé)
* **Description** :
  1. Alignement visuel de la page publique principale (Navbar, Hero, responsive, transitions).
  2. Amélioration de la lisibilité des cartes de stack et technologies en mode sombre.
* **Statut** : Terminé.

### [P1] PB-005 : Intégration Layout Admin Figma Make (Terminé)
* **Description** : Remplacement de l'apparence admin par le layout sombre et premium Figma avec barre de navigation rétractable.
* **Statut** : Terminé.

### [P1] PB-006 : Alignement Admin Projects Figma Make (Terminé)
* **Description** : Refonte de la table de liste des projets, de l'état de mise en avant et des actions d'édition sous format de design SaaS premium sombre.
* **Statut** : Terminé.

### [P1] PB-007 : Alignement Formulaires Admin Figma Make (Terminé)
* **Description** : Rendre les formulaires d'édition et création conformes au thème sombre premium (textareas adaptés, upload de couverture, carousel de miniatures, boutons épurés).
* **Statut** : Terminé.

### [P1] PB-008 : Dashboard Admin Figma Make (Terminé)
* **Description** : Intégration d'un tableau de bord moderne avec indicateurs de performances (KPIs), journal d'activité récente dynamique et raccourcis d'accès rapide.
* **Statut** : Terminé.

### [P1] PB-FIX-ADMIN : Reprise UI `/admin/projects` Figma Make (Terminé)
* **Description** : Remplacement de l'apparence de liste classique par une vue sombre premium avec en-tête de catalogue, recherche locale, miniatures, stack, statut, date et actions iconiques.
* **Statut** : Terminé.

### [P1] PB-009 : Audit et Tests de Sécurité Auth (Terminé)
* **Description** :
  1. Audit de la stratégie de tests.
  2. Mise en place de tests unitaires pour le middleware JWT du backend (Vitest).
  3. Écriture des tests d'intégration pour le composant `PrivateRoute` (Frontend).
* **Statut** : Terminé.

### [P1] PB-011 : CORS Dynamique pour le Backend (Terminé)
* **Description** : Remplacer la liste d'origines CORS codée en dur dans `server.ts` par la variable d'environnement `CORS_ORIGIN`. La valeur accepte plusieurs origines séparées par des virgules et s'applique aux compositions Docker de développement et de production via le même fichier d'environnement backend.
* **Statut** : Terminé.

### [P1] PB-012 : Tests d'intégration CRUD Projets (Terminé)
* **Description** : Ajouter des tests HTTP backend avec Vitest et Supertest pour les routes publiques et protégées des projets (`GET`, `POST`, `PUT`, `DELETE`), puis couvrir les pages publiques de liste et détail avec leurs états de chargement et d'erreur.
* **Statut** : Terminé.

### [P1] PB-003 : Tests Cloudinary et Carousels (Terminé)
* **Description** : Tests de non-régression frontend pour l'upload Cloudinary unsigned, le carousel de projets mis en avant piloté par `is_featured`/`featured_order` et le carousel de détail piloté par `gallery_images`.
* **Statut** : Terminé.

### [P2] PB-013 : Amélioration globale de l'Accessibilité (WCAG / a11y) (Terminé)
* **Description** : Ajout d'indicateurs de focus clavier, de noms accessibles sur les contrôles iconiques et les tiroirs de navigation, ainsi que d'annonces d'erreur pour les formulaires et les médias.
* **Statut** : Terminé.

### [P0] PB-014 : Finalisation Portfolio avant Job Dating
* **Description** : Vérifier rapidement le parcours recruteur : page d'accueil, projets visibles, images de couverture, GIF Pokémon, liens GitHub/démo, CV, contact et responsive mobile.
* **Statut** : À faire.

### [P0] PB-015 : Migration La Loge vers Front Statique + Nginx
* **Description** : Appliquer à La Loge la stratégie validée sur le portfolio : front buildé dans `/var/www/la-loge`, Nginx servant les fichiers statiques, backend et base de données conservés en Docker.
* **Statut** : À faire.

### [P0] PB-016 : CI/CD Front La Loge
* **Description** : Créer un workflow GitHub Actions pour La Loge afin de builder le front et synchroniser automatiquement `dist/` vers `/var/www/la-loge` via `rsync` à chaque push sur la branche principale.
* **Statut** : À faire.

### [P0] PB-017 : Préparation Alternance / Job Dating
* **Description** : Préparer les éléments essentiels pour jeudi : pitch court, CV, liste d'entreprises cibles, explication du portfolio, explication de La Loge et mise en avant du CI/CD.
* **Statut** : À faire.
