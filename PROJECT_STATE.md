# PROJECT_STATE.md

## Description du Projet
Portfolio professionnel d'Elyas Benyoub pour décrocher une alternance ESGI Bachelor 3 Ingénierie du Web et servir de démonstration technique premium auprès des recruteurs.

---

## État des Modules

### 1. État Docker
* **Base de données (`db`)** : Conteneur MySQL 8.0 opérationnel et persistant. Point d'entrée `init.sql` exécuté correctement.
* **Backend** : Conteneur Node.js 20 opérationnel (`portfolio_backend` servant l'API REST sur le port `3001`).
* **Frontend** : Conteneur configuré pour le développement. Le Dockerfile frontend utilise un serveur de développement et requiert un ajustement pour servir les builds statiques en production (voir backlog).

### 2. État Cloudinary
* Opérationnel côté frontend. Intégration de l'upload d'images sans signature (unsigned preset) via les variables d'environnement configurées dans le `.env` du frontend.
* Sécurité assurée : aucune clé secrète Cloudinary (`CLOUDINARY_API_SECRET`) n'est embarquée côté frontend.

### 3. État CMS
* Espace d'administration fonctionnel accessible sur `/admin`.
* Permet la création, modification, suppression de projets, ainsi que la configuration des carousels (sélection des projets mis en avant `is_featured` et ordre `featured_order`).

### 4. État GitHub Import
* Présence d'un script d'initialisation et d'import automatique dans `db/init.sql` pour charger directement les métadonnées de projets issus des dépôts GitHub publics d'Elyas Benyoub.

### 5. État Screenshots
* Les captures d'écran des projets sont hébergées sur Cloudinary. Les chemins relatifs historiques locaux d'images (ex: `/project-images/...`) sont résolus via un utilitaire de secours frontend.

### 6. État Figma Make
* **Statut** : Complètement intégré. Les pages publiques (`Home`, `Projects`, `Project Detail`, `Contact` et `Login`) ainsi que les styles de la charte visuelle sombre (`#0A0A0A`), les espacements et les cartes projets ont été réalignés fidèlement sur les références de `figma_make/`.

---

## Problèmes Connus
1. **Dockerfile Frontend en Mode Dev** : Actuellement, le conteneur frontend exécute l'application en mode dev. Un build de production multi-stage avec un reverse proxy (ex: Nginx) est nécessaire pour le déploiement final.
2. **CORS local en dur** : Le backend Express n'accepte que des origines locales (`localhost:5173`, etc.).
3. **Erreur de syntaxe Dockerfile Frontend** : `CMD["npm", ...]` sans espace dans `portfolio_frontend/Dockerfile` à corriger.

---

## Prochaine tâche recommandée
* **[PB-002] : CORS Dynamique pour le Backend**
  * Rendre dynamique les origines CORS acceptées par le serveur Express pour ne pas être bloqué lors du déploiement en production.
