FROM nginx:latest
WORKDIR /usr/share/nginx/html

#LABEL traefik.http.routers.frontpage.rule PathPrefix(`/`)
#LABEL traefik.http.routers.frontpage.middlewares target_is_static@file,errorcats@docker

COPY . .
