# ARCHITECTURE.md

Ce document décrit l'architecture technique globale du Portfolio professionnel d'Elyas Benyoub.

## Structure Globale
L'application est structurée sous forme de monorepo séparant distinctement le Frontend, le Backend et l'initialisation de la Base de Données.

```
├── db/                       # Initialisation SQL de la base de données
│   └── init.sql              # Schéma et données de base (tables projects et users)
├── portfolio_backend/        # API REST Express (TypeScript)
│   ├── src/
│   │   ├── config/           # Configuration base de données et initialisation schéma
│   │   ├── controllers/      # Gestionnaires de requêtes HTTP
│   │   ├── errors/           # Classes d'erreurs applicatives personnalisées
│   │   ├── middlewares/      # Middlewares (authentification JWT, validation, gestion globale d'erreurs)
│   │   ├── models/           # Interactions SQL directes (requêtes MySQL2)
│   │   ├── routes/           # Définition des routes de l'API
│   │   ├── services/         # Logique métier intermédiaire
│   │   ├── validators/       # Schémas de validation backend
│   │   └── server.ts         # Point d'entrée de l'application backend
│   └── Dockerfile            # Dockerfile backend (Node.js 20 build)
├── portfolio_frontend/       # Application React 19 (TypeScript, Vite)
│   ├── src/
│   │   ├── components/       # Composants réutilisables (dont formulaires et carousels)
│   │   ├── context/          # Contextes globaux (authentification, notifications)
│   │   ├── hooks/            # Hooks React personnalisés
│   │   ├── pages/            # Pages de l'application (Public et Admin)
│   │   ├── services/         # Intégrations API et Cloudinary
│   │   └── App.tsx           # Routage applicatif React Router
│   └── Dockerfile            # Dockerfile frontend (actuellement dev mode)
└── docker-compose.yml        # Orchestration locale (db, backend)
```

## Flux de Données et Upload d'Images
1. **Création d'un projet** :
   - L'administrateur remplit le formulaire sur `/admin/projects/new`.
   - Le frontend intercepte la soumission et uploade d'abord les fichiers images locaux sélectionnés directement vers **Cloudinary** via un preset non signé (unsigned).
   - Les URLs sécurisées générées par Cloudinary remplacent les fichiers dans le payload final.
   - Le frontend envoie le payload JSON au backend Express via une requête POST `/api/projects` signée avec le JWT d'authentification.
   - Le backend valide les données et insère les URLs de Cloudinary dans la table `projects` de MySQL sous forme de chaînes de caractères (ou de tableaux JSON pour la galerie).
