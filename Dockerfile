FROM nginx
WORKDIR /usr/share/nginx/html

ENV VIRTUAL_HOST=localhost

COPY . .
EXPOSE 80