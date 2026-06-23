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
