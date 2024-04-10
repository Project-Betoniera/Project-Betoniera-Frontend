FROM node:alpine as build

WORKDIR /app

ARG API_URL
ENV API_URL=$API_URL
ARG PLAUSIBLE_DOMAIN
ENV PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN
ARG IS_BETA_BUILD
ENV IS_BETA_BUILD=$IS_BETA_BUILD

COPY . /app
RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
