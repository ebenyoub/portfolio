# PROJECT_STATE.md

## Description du Projet
Portfolio professionnel d'Elyas Benyoub pour décrocher une alternance ESGI Bachelor 3 Ingénierie du Web et servir de démonstration technique premium auprès des recruteurs.
L'application comprend une partie Frontend de présentation et de gestion, une partie Backend de gestion de contenu (CMS), et une base de données MySQL, le tout orchestré par Docker.

## Statut Actuel
- **Frontend** : Opérationnel. Construit avec React 19, TypeScript, Vite, React Router, Tailwind CSS v4, React Hook Form et Zod. Intégration d'uploads d'images Cloudinary non signés côté client.
- **Backend** : Opérationnel. API REST construite avec Express 5, TypeScript, MySQL2 (via pool de connexions), JWT pour l'authentification admin, et Nodemailer pour le formulaire de contact.
- **Base de données** : MySQL 8. Table `projects` et table `users` configurées avec les structures nécessaires (carousels, images de galerie, drapeaux de mise en avant).

## Fichiers Modifiés récemment / Historique de pilotage
- Initialisation de la documentation de pilotage IA (juin 2026).
- Audit technique complet réalisé.

## Risques et Bloquants Identifiés
1. **Risque d'images brisées** : L'intégration Cloudinary repose sur le frontend directement avec un preset non signé. Si le preset ou le cloud name ne sont pas définis ou mal configurés, les créations/éditions échoueront.
2. **Dockerfile Frontend incomplet** : Le `Dockerfile` frontend utilise `CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]` au lieu d'un serveur web de production (ex: Nginx) pour servir les fichiers statiques buildés, ce qui n'est pas adapté pour la production.
3. **Sécurité JWT** : Signature avec un secret qui doit être robuste en production.
4. **Erreur de syntaxe Dockerfile Frontend** : `CMD["npm", ...]` manque d'un espace après `CMD` dans le Dockerfile frontend (`CMD["npm", ...]` génère une erreur au build).
