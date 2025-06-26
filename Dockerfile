FROM node:20-alpine

WORKDIR /app

# 1. Copier package.json + package-lock.json
COPY package*.json ./

# 2. Installer les dépendances (incl. devDependencies)
RUN npm install

# 3. Installer la CLI Nest globalement
RUN npm install -g @nestjs/cli

# 4. Copier le reste du code
COPY . .

# 5. Lancer en mode développement
CMD ["npm", "run", "start:dev"]
