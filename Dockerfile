# Compila il progetto e crea un'immagine di produzione
FROM node:20-alpine as development
WORKDIR /app
COPY package*.json /app/
RUN npm install

# Copio i file & compilo
COPY . /app
RUN npm run build


# Creo Immagine di produzione
FROM nginx:alpine

WORKDIR /app

# Copio i file compilati
COPY --from=development /app/dist /usr/share/nginx/html

# Espongo la porta
EXPOSE 443