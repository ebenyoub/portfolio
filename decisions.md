# decisions.md

# Registre des Décisions Architecturales (ADR)

## ADR 1 : Stockage et Upload d'Images
- **Date** : Juin 2026
- **Statut** : Accepté
- **Contexte** : Le backend ne stocke plus les fichiers physiques uploadés pour éviter de saturer le serveur de production et simplifier les sauvegardes.
- **Décision** : Utilisation de Cloudinary côté frontend via des presets non signés (unsigned presets). Les URLs retournées par Cloudinary sont stockées dans les colonnes `image_url` et `gallery_images` de la base de données.
- **Conséquences** :
  - Pas d'API secret Cloudinary dans le frontend (obligatoire pour la sécurité).
  - Les anciennes URLs et chemins locaux (ex. `/project-images/...`) doivent continuer à être supportés et rendus correctement.
  - Le frontend gère directement l'envoi de fichiers vers Cloudinary avant de transmettre les URLs au backend pour la création/modification de projets.

## ADR 2 : Validation des formulaires unifiée
- **Date** : Juin 2026
- **Statut** : Accepté
- **Contexte** : Assurer la cohérence des données soumises au backend et offrir des retours visuels immédiats de qualité aux utilisateurs.
- **Décision** : Utilisation systématique de **React Hook Form** combiné à **Zod** pour la validation côté frontend, et de schemas de validation côté backend.
- **Conséquences** :
  - Alignement strict des contraintes de taille, de formats (ex: URLs) et de champs obligatoires (marqués par `*`).
  - Affichage systématique des messages d'erreur sous les champs respectifs.
