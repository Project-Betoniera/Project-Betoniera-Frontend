# Compila il progetto e crea un'immagine di produzione
FROM node:alpine as build

WORKDIR /app
COPY package*.json /app/
RUN npm ci

# Definisce le variabili d'ambiente da usare durante la build
ARG API_URL
ENV API_URL=$API_URL
ARG PLAUSIBLE_DOMAIN
ENV PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN
ARG IS_BETA_BUILD
ENV IS_BETA_BUILD=$IS_BETA_BUILD

# Copio i file & compilo
COPY . /app
RUN npm run build

# Creo Immagine di produzione
FROM nginx:alpine

# Copio la configurazione di nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

# Copio i file compilati
COPY --from=build /app/dist /usr/share/nginx/html

# Espongo la porta
EXPOSE 80
