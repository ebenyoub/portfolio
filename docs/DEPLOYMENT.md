# DEPLOYMENT.md

# Guide de Déploiement

Ce document explique comment déployer le Portfolio d'Elyas Benyoub en production.

## Configuration Requise
- Un serveur VPS Linux (ex. Ubuntu)
- Docker et Docker Compose installés
- Un compte Cloudinary avec un Preset d'Upload Non Signé (Unsigned Upload Preset)
- Un serveur SMTP (ou compte Gmail avec mot de passe d'application) pour l'envoi de mails de contact.

---

## 1. Variables d'Environnement

### Backend (`portfolio_backend/.env`)
Créez et configurez le fichier `.env` sur le serveur de production :
```env
PORT=3001
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_robuste
DB_NAME=portfolio_db
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
MAIL_USER=votre_email@gmail.com
MAIL_PASS=votre_mot_de_passe_d_application
MAIL_TO=elyas.benyoub@email.com
```

### Frontend (`portfolio_frontend/.env`)
Configurez le fichier `.env` du frontend avant le build de production :
```env
VITE_API_URL=https://votre-domaine.com/api
VITE_CLOUDINARY_CLOUD_NAME=nom_de_votre_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=nom_de_votre_preset_unsigned
```

---

## 2. Déploiement avec Docker Compose (Recommandé)

Une fois les configurations prêtes, lancez la commande suivante à la racine pour compiler et exécuter les services :
```bash
docker compose up -d --build
```

### Remarque de Production
Dans une configuration de production idéale, le service `backend` doit écouter uniquement en local, et un reverse-proxy Nginx configuré sur le serveur hôte doit gérer :
1. Le chiffrement SSL/TLS (HTTPS via Let's Encrypt).
2. Le routage des requêtes `/api/*` vers le conteneur backend (port `3001`).
3. Le service des fichiers statiques du frontend buildé.
