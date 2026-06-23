# TASKS.md

## Tâches en cours
- [x] Audit complet du code existant et des configurations d'infrastructure.
- [x] Structuration de la documentation de pilotage IA.

## Tâches futures
- [ ] Correction de l'erreur de syntaxe dans le `Dockerfile` frontend (`CMD ["npm", ...]` au lieu de `CMD["npm", ...]`).
- [ ] Migration du `Dockerfile` frontend vers une configuration multi-stage avec Nginx pour le service des fichiers statiques de production.
- [ ] Validation complète du flux d'upload Cloudinary unsigned avec les variables d'environnement.
- [ ] Ajout des tests de non-régression manquants listés dans le TODO.md (mock Cloudinary, carousel d'accueil, carousel de détail).
- [ ] Sécurisation de la configuration CORS du backend pour la production.
