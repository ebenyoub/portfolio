# AGENTS.md

## Projet

Portfolio professionnel d'Elyas Benyoub.

Objectifs :

* présenter les projets clairement pour un recruteur ;
* mettre en avant les compétences techniques ;
* conserver un CMS admin complet ;
* garder une architecture simple et maintenable.

## Stack

Frontend :

* React 19
* TypeScript
* Vite
* React Router
* React Hook Form
* Zod
* Tailwind CSS v4

Backend :

* Express 5
* TypeScript
* MySQL2
* JWT
* Nodemailer

Infrastructure :

* Docker Compose
* MySQL 8

## Règles essentielles

Ne pas casser :

* `/login`
* `/admin`
* `/admin/projects/new`
* `/admin/projects/:id/edit`

La base fraîche est définie par :

* `db/init.sql`

Le carousel de détail utilise `gallery_images`.
S'il n'y a aucune image, ne pas afficher de carousel ni d'espace vide.

Le carousel d'accueil utilise `is_featured` et `featured_order`.
La sélection et l'ordre sont pilotés depuis `/admin`.
S'il n'y a aucun projet sélectionné, ne pas afficher de carousel ni d'espace vide.

## Images

Le backend ne stocke plus les fichiers uploadés.
Les uploads d'images passent par Cloudinary côté frontend avec un preset unsigned.

Ne jamais mettre `CLOUDINARY_API_SECRET` dans le frontend.

Les champs `image_url` et `gallery_images` stockent uniquement des URLs ou chemins historiques.
Les anciennes URLs locales doivent continuer à s'afficher.

## Formulaires

Tous les formulaires utilisent React Hook Form et Zod.

Règles :

* erreurs sous les champs ;
* champs obligatoires marqués avec `*` ;
* validation frontend et backend cohérentes.

## Validation

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
