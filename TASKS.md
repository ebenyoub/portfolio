# TASKS.md

## Tâches en cours
- [x] Audit complet du code existant et des configurations d'infrastructure.
- [x] Structuration de la documentation de pilotage IA.
- [x] Correction de l'erreur de syntaxe dans le `Dockerfile` frontend et migration vers Nginx multi-stage (PB-001).
- [x] Séparation de l'usage local et production de MySQL via `docker-compose.prod.yml` (PB-002 Phase 2).
- [x] Isolation et correction des secrets Docker MySQL (PB-002 Phase 3).
- [x] Alignement visuel réduit Figma Make (PB-004 Phase 2).
- [x] Optimisation de la lisibilité des cartes Stack (PB-004 Phase 3).
- [x] Intégration du Layout Admin premium (PB-005 Phase 2).
- [x] Alignement de la table des projets admin (PB-006).
- [x] Alignement des formulaires admin (création / édition) avec Figma Make (PB-007).
- [x] Intégration du Dashboard Admin premium aligné avec Figma Make (PB-008).
- [x] Reprise de l'écran `/admin/projects` pour respecter plus fidèlement Figma Make (PB-FIX-ADMIN).
- [x] Tests unitaires et d'intégration de sécurité Auth (PB-009 Phase 2).
- [x] Tests d'intégration CRUD Projets backend et pages Projets frontend (PB-012).
- [x] Configuration CORS backend dynamique pour les environnements dev et production (PB-011).
- [x] Tests Cloudinary et carousels frontend avec mocks réseau (PB-003).
- [x] Amélioration de l'accessibilité du portfolio public et de l'admin (PB-013).

## Tâches futures
- [ ] Finaliser la revue recruteur du portfolio avant le job dating : projets visibles, images, liens, CV, contact, responsive.
- [ ] Raccorder le composant `FeaturedProjectsCarousel` à la page d'accueil en respectant Figma Make si cela apporte une vraie valeur avant jeudi.
- [ ] Migrer La Loge vers la même architecture que le portfolio : front statique dans `/var/www/la-loge`, backend et base de données en Docker, Nginx en reverse proxy.
- [ ] Mettre en place le CI/CD GitHub Actions pour le front de La Loge.
- [ ] Préparer les supports alternance : pitch court, CV, liste d'entreprises et explication des projets.
