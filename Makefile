.PHONY: help up down logs ps frontend full-dev backend-local lint build test validate clean status

help:
	@echo "=== Commandes Docker (MySQL + Backend) ==="
	@echo "make up             -> Démarre db + backend dans Docker"
	@echo "make down           -> Arrête les conteneurs Docker"
	@echo "make logs           -> Affiche les logs des conteneurs"
	@echo "make ps             -> Liste les conteneurs actifs"
	@echo ""
	@echo "=== Commandes Local Dev (Frontend) ==="
	@echo "make frontend       -> Lance le frontend local (Vite)"
	@echo "make full-dev       -> Démarre Docker (db + API) puis lance le frontend local"
	@echo "make backend-local  -> Lance le backend localement (usage exceptionnel)"
	@echo ""
	@echo "=== Commandes de Validation & Qualité ==="
	@echo "make lint           -> Vérifie le code frontend + backend"
	@echo "make build          -> Compile le code frontend + backend"
	@echo "make test           -> Lance les tests unitaires du frontend"
	@echo "make validate       -> Enchaîne lint + build + test (validation CI locale)"
	@echo ""
	@echo "=== Utilitaires ==="
	@echo "make status         -> État de Colima"
	@echo "make clean          -> Nettoie les caches Docker"

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker ps

frontend:
	cd portfolio_frontend && npm run dev

full-dev:
	docker compose up -d db backend
	@echo "🚀 Base de données & API REST démarrées sur Docker."
	@echo "Lancement du frontend local..."
	cd portfolio_frontend && npm run dev

backend-local:
	cd portfolio_backend && npm run dev

lint:
	@echo "🔍 Linting Frontend..."
	cd portfolio_frontend && npm run lint
	@echo "🔍 Linting Backend..."
	cd portfolio_backend && npm run lint

build:
	@echo "🛠️ Build Frontend..."
	cd portfolio_frontend && npm run build
	@echo "🛠️ Build Backend..."
	cd portfolio_backend && npm run build

test:
	@echo "🧪 Tests Frontend..."
	cd portfolio_frontend && npm run test -- --run
	@echo "🧪 Tests Backend..."
	cd portfolio_backend && npm run test

validate: lint build test
	@echo "✅ Validation complète réussie !"

status:
	colima status

clean:
	docker builder prune -f

