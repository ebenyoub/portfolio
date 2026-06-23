# TODO.md

## Cloudinary

* [ ] Configurer `VITE_CLOUDINARY_CLOUD_NAME`.
* [ ] Configurer `VITE_CLOUDINARY_UPLOAD_PRESET` avec un preset unsigned.
* [ ] Vérifier l'upload réel d'une image principale depuis `/admin/projects/new`.
* [ ] Vérifier l'upload réel de plusieurs images galerie.
* [ ] Vérifier qu'une erreur Cloudinary bloque la sauvegarde backend.
* [ ] Vérifier que l'édition ne ré-uploade pas les URLs existantes.
* [ ] Vérifier que les anciennes URLs locales restent affichées.

## Infrastructure & Docker

* [ ] Corriger l'erreur de syntaxe sur `CMD` dans le `Dockerfile` frontend.
* [ ] Configurer le `Dockerfile` frontend pour la production (build multi-stage avec serveur Nginx).
* [ ] Rendre les origines CORS configurables via une variable d'environnement `CORS_ORIGIN` sur le backend.

## Tests réutilisables

* [ ] Ajouter un helper de rendu pour les formulaires admin.
* [ ] Ajouter des fixtures projet réalistes.
* [ ] Ajouter un mock Cloudinary partagé.
* [ ] Ajouter un test de non-régression pour le carousel d'accueil.
* [ ] Ajouter un test de non-régression pour le carousel de détail.
* [ ] Ajouter un test de non-régression pour les anciennes images locales.

## Validation globale

Frontend :

```bash
npm run test
npm run lint
npm run build
```

Backend :

```bash
npm run lint
npm run build
```
