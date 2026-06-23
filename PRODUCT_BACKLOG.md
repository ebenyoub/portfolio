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

### [P0] PB-001 : Correction et optimisation Docker pour la Production
* **Description** :
  1. Corriger l'erreur syntaxique de la ligne 11 du `Dockerfile` frontend (`CMD["npm", ...]` sans espace).
  2. Remplacer l'exécution en mode dev (`npm run dev`) dans le `Dockerfile` frontend par un build multi-stage compilant le projet (`npm run build`) et servant les fichiers statiques via un serveur Nginx configuré et sécurisé.
* **Impact** : Déploiement en production possible, optimisé et sécurisé.
* **Estimation** : 35 min.

### [P1] PB-002 : CORS Dynamique pour le Backend
* **Description** : Remplacer la liste d'origines CORS codée en dur dans `server.ts` par une variable d'environnement `CORS_ORIGIN` (ex. `http://localhost:5173` en dev et `https://elyas-benyoub.fr` en production).
* **Impact** : Évite les erreurs de requêtes cross-origin en production.
* **Estimation** : 15 min.

### [P1] PB-003 : Écriture de Tests de Non-Régression pour Cloudinary et les Carousels
* **Description** : Ajouter des tests unitaires et d'intégration frontend (Vitest) simulant le mock Cloudinary pour l'upload d'images, et testant le comportement du carousel d'accueil ( featured projects ) et de détails.
* **Impact** : Garantit la stabilité du code lors des futures modifications.
* **Estimation** : 1h30.

### [P2] PB-004 : Amélioration globale de l'Accessibilité (WCAG / a11y)
* **Description** : Rajouter des attributs d'accessibilité `aria-label` manquants sur les liens purement iconiques (réseaux sociaux, etc.) et vérifier le comportement de la navigation au clavier.
* **Impact** : Portfolio accessible et mieux valorisé techniquement.
* **Estimation** : 30 min.

### [P3] PB-005 : Rationalisation du Makefile (Terminé)
* **Description** : Intégrer les scripts de build, de test et de lissage (linting) globaux dans le Makefile pour permettre une validation rapide et unifiée du projet en local.
* **Impact** : Améliore le confort de développement local.
* **Estimation** : Terminé.
