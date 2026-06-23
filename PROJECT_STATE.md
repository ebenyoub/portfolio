# PROJECT_STATE.md

## Description du Projet
Portfolio professionnel d'Elyas Benyoub pour décrocher une alternance ESGI Bachelor 3 Ingénierie du Web et servir de démonstration technique premium auprès des recruteurs.

---

## État des Modules

### 1. État Docker
* **Base de données (`db`)** : Conteneur MySQL 8.0 opérationnel et persistant. Point d'entrée `init.sql` exécuté correctement. Port 3308 lié à `127.0.0.1` en local pour éviter toute exposition publique.
* **Backend** : Conteneur Node.js 20 opérationnel (port `3001`).
* **Frontend** : Conteneur opérationnel avec build multi-stage et serveur Nginx Alpine (port `8080` mappé vers le port `80`).
* **Sécurité & Production** : Fichier `docker-compose.prod.yml` en place pour retirer l'exposition de ports de MySQL en production. Les secrets de la base de données sont isolés dans `.env.mysql` pour éviter d'exposer les secrets applicatifs (JWT, Cloudinary, Mail) au conteneur MySQL.

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
1. **CORS local en dur** : Le backend Express n'accepte que des origines locales (`localhost:5173`, etc.).

---

## Prochaine tâche recommandée
* **[PB-002] : CORS Dynamique pour le Backend**
  * Rendre dynamique les origines CORS acceptées par le serveur Express pour ne pas être bloqué lors du déploiement en production.

