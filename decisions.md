# decisions.md

# Registre des Décisions Architecturales (ADR)

## ADR 1 : Stockage et Upload d'Images
* **Statut** : Accepté
* **Contexte** : Pour simplifier l'hébergement et économiser de l'espace disque sur le VPS de production, le backend ne stocke plus physiquement d'images d'illustration de projet.
* **Décision** : Le frontend gère l'upload d'images directement vers Cloudinary via un preset d'upload non signé (unsigned preset) côté client avant d'envoyer les URLs résultantes à l'API backend pour la création ou mise à jour.
* **Conséquences** :
  - Pas d'API secret Cloudinary dans le frontend (obligatoire pour des raisons de sécurité).
  - Les anciennes URLs et chemins locaux (ex. `/project-images/...`) doivent continuer à être supportés et rendus correctement.

## ADR 2 : Refonte Visuelle Figma Make
* **Statut** : Accepté
* **Contexte** : Alignement du portfolio sur une référence de design premium issue de `figma_make`.
* **Décision** : Remplacer l'intégralité du style de la charte de couleurs claire précédente par la structure de thémage sombre (`#0A0A0A`), en réorganisant les sections de la page d'accueil (Hero, Stack, Projects, Timeline, Pre-contact) et la page Contact.
* **Conséquences** :
  - Identité haut de gamme, polices Manrope et Inter intégrées.
  - Préservation intégrale de la structure de données API et de la validation de formulaires React Hook Form/Zod.

## ADR 3 : Build Multi-Stage Frontend Production avec Nginx
* **Statut** : Accepté
* **Contexte** : Assurer des performances optimales et sécuriser le service de fichiers statiques en production.
* **Décision** : Le frontend est configuré dans un Dockerfile multi-stage. L'étape de compilation produit les assets optimisés à l'aide de Vite, puis Nginx en version alpine sert les fichiers statiques à l'aide d'une configuration de réécriture d'URL assurant la compatibilité avec le routeur de React (`nginx.conf`).
* **Conséquences** :
  - Le frontend est isolé du serveur Node de développement.
  - Possibilité de déployer sur port HTTP standard (port `80` exposé en interne, mappé sur le port souhaité de l'hôte, ex: `8080`).

## ADR 4 : Sécurisation Docker Minimale (Séparation Dev/Prod)
* **Statut** : Accepté
* **Contexte** : Sécuriser la base de données MySQL en production tout en préservant le confort du développement local.
* **Décision** : 
  1. Restreindre l'exposition du port de la base de données MySQL (`3308`) à la boucle locale (`127.0.0.1`) dans le fichier principal `docker-compose.yml`.
  2. Créer un fichier de surcharge `docker-compose.prod.yml` pour la production qui retire complètement l'exposition de ports de MySQL via l'opérateur `!reset` et configure le chargement des variables d'environnement (`env_file`) pour les services de base de données et de backend.
* **Conséquences** :
  - MySQL n'est plus accessible de l'extérieur en production, limitant la surface d'attaque.
  - Pas d'impact sur le flux de développement local.

## ADR 5 : Formulaires et Layout Admin Figma Make
* **Statut** : Accepté
* **Contexte** : Assurer la cohérence visuelle de l'espace d'administration avec la charte graphique sombre haut de gamme issue de `figma_make`.
* **Décision** : Moderniser l'ensemble de l'interface d'administration sous format SaaS sombre (`#111111`, `#0A0A0A`, bordures `#262626`), y compris la barre latérale rétractable, la table de gestion des projets, les formulaires de création et d'édition de projet (champs sombres, textareas, miniatures de galerie, boutons d'action) et le tableau de bord avec indicateurs clés (KPIs) et liste d'activité.
* **Conséquences** :
  - L'expérience administrateur est homogène et premium.
  - Aucune logique fonctionnelle (RHF/Zod, Cloudinary, CRUD) n'a été altérée.

## ADR 6 : Tests de Sécurité Auth avec Vitest
* **Statut** : Accepté
* **Contexte** : Sécuriser les accès sensibles (CRUD projets) de l'administration contre les régressions accidentelles de sécurité.
* **Décision** : Implémenter des tests automatisés pour valider le contrôle d'accès : tests unitaires du middleware JWT Express du backend, et tests d'intégration du wrapper de navigation React `PrivateRoute` côté frontend.
* **Conséquences** :
  - Prévention robuste contre les fuites d'authentification ou les accès anonymes aux routes protégées.
  - Automatisation complète via `make test` et `make validate` (CI locale).

## ADR 7 : Tests d'Intégration CRUD Projets
* **Statut** : Accepté
* **Contexte** : Les routes Projets constituent le coeur fonctionnel du portfolio et doivent être couvertes sans dépendre d'une base MySQL réelle.
* **Décision** : Utiliser Vitest avec Supertest sur une application Express locale et mocker le pool MySQL. La commande backend cible `src` afin d'exclure les copies compilées dans `dist` et de ne pas exécuter chaque test deux fois.
* **Conséquences** :
  - Les réponses HTTP, l'authentification/autorisation et la validation sont exercées de bout en bout dans le routeur.
  - La suite reste déterministe et ne requiert ni Docker ni une base de données active.
