# TODO.md

## Priorité actuelle

Objectif principal : avoir un portfolio opérationnel et présentable rapidement pour le job dating de jeudi, puis appliquer la même stratégie de déploiement à La Loge.

## Portfolio

### Terminé

* [x] Migrer le front du portfolio vers `/var/www/portfolio` sur le VPS.
* [x] Servir le front directement avec Nginx, sans conteneur frontend Docker.
* [x] Garder le backend portfolio en Docker.
* [x] Configurer le reverse proxy Nginx : `/` vers `/var/www/portfolio`, `/api/` vers le backend Docker.
* [x] Corriger `VITE_API_URL` pour utiliser `/api` en production.
* [x] Créer un workflow GitHub Actions pour déployer le front automatiquement.
* [x] Ajouter `lint`, `tests`, `build`, puis déploiement dans le workflow CI/CD.
* [x] Ajouter le support des GIF dans l'upload Cloudinary.
* [x] Corriger le preset Cloudinary local : `portfolio_upload`.
* [x] Supprimer la réinjection automatique des images locales Cub3D dans la galerie.
* [x] Vérifier que la suppression des images de galerie reste bien sauvegardée.

### À faire avant le job dating

* [ ] Vérifier les projets visibles sur la page d'accueil.
* [ ] Vérifier que les projets importants ont une image de couverture propre.
* [ ] Vérifier que le GIF Pokémon fonctionne en couverture.
* [ ] Vérifier que les liens GitHub et démo fonctionnent.
* [ ] Vérifier le CV téléchargeable.
* [ ] Vérifier la section contact en bas de la page d'accueil.
* [ ] Faire une revue mobile rapide.
* [ ] Faire une revue recruteur rapide : page d'accueil, projets, détails, contact.

### Plus tard

* [ ] Nettoyer les warnings React `act(...)` dans `apiFetch.test.ts`.
* [ ] Exclure `coverage/` du lint si nécessaire.
* [ ] Optimiser le bundle Vite supérieur à 500 kB avec du code splitting.
* [ ] Nettoyer progressivement `public/project-images/` quand toutes les images seront sur Cloudinary.
* [ ] Compresser ou remplacer le PDF du CV si son poids est trop élevé.

## La Loge

### Objectif

Appliquer la même architecture professionnelle que le portfolio :

* front buildé servi depuis `/var/www/la-loge` ;
* backend et base de données conservés en Docker ;
* Nginx en reverse proxy ;
* CI/CD GitHub Actions pour déployer le front automatiquement.

### Étapes VPS

* [ ] Inspecter l'existant : `/srv/apps/la-loge`, `docker-compose.yml`, conteneurs Docker, config Nginx.
* [ ] Vérifier que `/var/www/la-loge` existe et appartient à l'utilisateur `elyas`.
* [ ] Builder le front La Loge en local.
* [ ] Copier manuellement le premier `dist/` vers `/var/www/la-loge` avec `rsync`.
* [ ] Modifier Nginx pour servir `/var/www/la-loge` au lieu du conteneur frontend.
* [ ] Garder `/api/` proxyfié vers le backend Docker La Loge.
* [ ] Tester que La Loge fonctionne sans le conteneur frontend.
* [ ] Arrêter puis retirer le service frontend Docker de La Loge si tout est validé.

### Étapes CI/CD

* [ ] Réutiliser la clé SSH GitHub Actions dédiée existante si possible.
* [ ] Ajouter les secrets GitHub nécessaires pour La Loge.
* [ ] Créer le workflow GitHub Actions de déploiement front.
* [ ] Ajouter au minimum : installation, lint si disponible, build, rsync vers `/var/www/la-loge`.
* [ ] Pousser sur GitHub et vérifier que le déploiement automatique fonctionne.

## Alternance / job dating

* [ ] Finaliser les projets affichés dans le portfolio.
* [ ] Préparer un pitch court : profil, stack, projet portfolio, La Loge, objectif Bachelor 3 ESGI.
* [ ] Préparer une version courte du CV.
* [ ] Préparer une liste d'entreprises à cibler jeudi.
* [ ] Préparer 3 phrases pour expliquer le CI/CD du portfolio.
* [ ] Préparer 3 phrases pour expliquer La Loge comme projet client réel.
