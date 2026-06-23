.PHONY: help db db-stop db-restart db-logs up down build logs ps \
	backend frontend full-dev status clean

help:
	@echo "=== Docker ==="
	@echo "make db          -> Démarre uniquement MySQL"
	@echo "make db-stop     -> Arrête MySQL"
	@echo "make db-restart  -> Redémarre MySQL"
	@echo "make db-logs     -> Logs MySQL"
	@echo "make up          -> Démarre tous les conteneurs"
	@echo "make down        -> Arrête tous les conteneurs"
	@echo "make build       -> Rebuild + démarre"
	@echo "make logs        -> Logs Docker"
	@echo "make ps          -> Liste les conteneurs"
	@echo ""
	@echo "=== Local Dev ==="
	@echo "make backend     -> Lance le backend local"
	@echo "make frontend    -> Lance le frontend local"
	@echo "make full-dev    -> Lance DB + URLs utiles"
	@echo ""
	@echo "=== Colima ==="
	@echo "make status      -> État Colima"
	@echo "make clean       -> Nettoyage Docker"

db:
	docker compose up -d db

db-stop:
	docker compose stop db

db-restart:
	docker compose restart db

db-logs:
	docker compose logs -f db

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

logs:
	docker compose logs -f

ps:
	docker ps

backend:
	cd portfolio_backend && npm run dev

frontend:
	cd portfolio_frontend && npm run dev

full-dev:
	@echo "🚀 Démarrage de la base..."
	docker compose up -d db
	@echo ""
	@echo "Backend  : http://localhost:3001"
	@echo "Frontend : http://localhost:5173"
	@echo "MySQL    : localhost:3307"

status:
	colima status

clean:
	docker builder prune -f
