# Product Backlog

Ce document répertorie et priorise l'ensemble des tâches et améliorations nécessaires pour amener le portfolio à un niveau professionnel et prêt pour la production.

## Priorités de classification
- **P0** : Bloquant (Empêche le déploiement ou l'exécution correcte de l'application)
- **P1** : Important (Impacte fortement l'expérience utilisateur, le SEO ou la qualité technique)
- **P2** : Amélioration (Optimisations, fonctionnalités non critiques)
- **P3** : Confort (Amélioration du flux de travail développeur, outillage)

---

### [P0 - Bloquant] PB-001 : Correction syntaxe Dockerfile Frontend
- **Description** : Le fichier `portfolio_frontend/Dockerfile` contient une erreur de syntaxe à la ligne 11 (`CMD["npm", ...]` sans espace). Cela fait échouer le build de l'image Docker du frontend.
- **Impact** : Déploiement Docker impossible.
- **Estimation** : 5 min.

### [P0 - Bloquant] PB-002 : Dockerfile Frontend pour la Production (Nginx)
- **Description** : Le `Dockerfile` frontend actuel exécute l'application en mode développement (`npm run dev`) à l'intérieur du conteneur. Il faut configurer un build multi-stage qui génère les fichiers statiques de production (`npm run build`) et les sert via un serveur Nginx optimisé.
- **Impact** : Performances et sécurité en production médiocres, fuite de mémoire potentielle liée au serveur de dev de Vite en prod.
- **Estimation** : 30 min.

### [P1 - Important] PB-003 : Configuration CORS restrictive pour la Production
- **Description** : Dans `server.ts`, l'origine CORS accepte uniquement des ports locaux (`localhost:5173`, etc.). Il faut rendre les origines autorisées configurables via une variable d'environnement `CORS_ORIGIN` pour accepter le nom de domaine de production.
- **Impact** : Bloque les requêtes API en production ou force à ouvrir les CORS à tous (`*`) ce qui pose un problème de sécurité.
- **Estimation** : 15 min.

### [P1 - Important] PB-004 : Validation des variables d'environnement Cloudinary
- **Description** : S'assurer que le frontend possède un mécanisme de secours ou un message clair si les variables d'environnement Cloudinary (`VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET`) sont manquantes ou incorrectes.
- **Impact** : Améliore la robustesse de l'espace administration en évitant des crashs silencieux en cas d'oubli de configuration.
- **Estimation** : 20 min.

### [P1 - Important] PB-005 : SEO et balises Meta du Frontend
- **Description** : Remplacer les titres génériques et ajouter des meta descriptions valides dans `index.html` pour améliorer le référencement naturel du portfolio d'Elyas Benyoub.
- **Impact** : Visibilité recruteur sur les moteurs de recherche.
- **Estimation** : 15 min.

### [P1 - Important] PB-006 : Implémentation des tests de non-régression Cloudinary et carousels
- **Description** : Écrire les tests manquants identifiés dans le `TODO.md` : Mock de Cloudinary pour les tests d'intégration, test de rendu du carousel d'accueil (featured projects) et du carousel de détails.
- **Impact** : Stabilité et non-régression lors des futures modifications.
- **Estimation** : 1h30.

### [P2 - Amélioration] PB-007 : Amélioration de l'Accessibilité (a11y)
- **Description** : Vérifier le contraste des couleurs (notamment avec Tailwind v4), ajouter des attributs `aria-label` sur les liens iconiques et s'assurer que la navigation au clavier est pleinement fonctionnelle sur tout le site.
- **Impact** : Qualité technique et inclusion.
- **Estimation** : 45 min.

### [P2 - Amélioration] PB-008 : Gestion fine des erreurs SQL côté Backend
- **Description** : Dans les services et modèles backend, attraper spécifiquement les codes d'erreur MySQL (comme les violations de contraintes uniques) pour renvoyer des messages d'erreur API plus précis au lieu d'une erreur 500 générique.
- **Impact** : Facilité de débogage et expérience utilisateur de l'admin.
- **Estimation** : 30 min.

### [P3 - Confort] PB-009 : Script de build global et automatisation
- **Description** : Centraliser les scripts de build frontend/backend dans le Makefile racine pour simplifier la validation en local avec une seule commande.
- **Impact** : Productivité développeur.
- **Estimation** : 15 min.
