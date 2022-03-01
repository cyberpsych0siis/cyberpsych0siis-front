FROM nginx:latest
WORKDIR /usr/share/nginx/html

LABEL traefik.http.routers.userrouter.rule PathPrefix(`/`)
LABEL traefik.http.routers.userrouter.middlewares target_is_static@file,errorcats@docker

COPY . .
