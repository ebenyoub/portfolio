# Utilise l'image Node.js LTS basée sur Alpine Linux
FROM node:20-alpine

# Définit un répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances, puis les installe
COPY package*.json ./
RUN npm install

# Copie le reste du code source dans le conteneur
COPY . .

RUN npm run build

EXPOSE 3001

# Définit la commande pour exécuter l'application
CMD ["npm", "start"]
