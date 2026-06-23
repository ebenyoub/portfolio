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

### [P1] PB-009 : Audit et Tests de Sécurité Auth (Terminé)
* **Description** :
  1. Audit de la stratégie de tests.
  2. Mise en place de tests unitaires pour le middleware JWT du backend (Vitest).
  3. Écriture des tests d'intégration pour le composant `PrivateRoute` (Frontend).
* **Statut** : Terminé.

### [P1] PB-011 : CORS Dynamique pour le Backend (À faire)
* **Description** : Remplacer la liste d'origines CORS codée en dur dans `server.ts` par une variable d'environnement `CORS_ORIGIN` (ex. `http://localhost:5173` en dev et `https://elyas-benyoub.fr` en production).
* **Statut** : À faire.

### [P1] PB-012 : Tests d'intégration CRUD Projets (Terminé)
* **Description** : Ajouter des tests HTTP backend avec Vitest et Supertest pour les routes publiques et protégées des projets (`GET`, `POST`, `PUT`, `DELETE`), puis couvrir les pages publiques de liste et détail avec leurs états de chargement et d'erreur.
* **Statut** : Terminé.

### [P1] PB-003 : Tests Cloudinary et Carousels (À faire)
* **Description** : Ajouter les tests de non-régression frontend pour l'upload Cloudinary unsigned, le carousel d'accueil piloté par `is_featured`/`featured_order` et le carousel de détail piloté par `gallery_images`.
* **Statut** : À faire.

### [P2] PB-013 : Amélioration globale de l'Accessibilité (WCAG / a11y) (À faire)
* **Description** : Rajouter des attributs d'accessibilité `aria-label` manquants sur les liens purement iconiques (réseaux sociaux, etc.) et vérifier le comportement de la navigation au clavier.
* **Statut** : À faire.
