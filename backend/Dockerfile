FROM node:22-bookworm

# Asigna el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación en el contenedor
COPY . .

RUN npm run build





