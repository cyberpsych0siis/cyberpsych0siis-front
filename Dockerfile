FROM nginx
WORKDIR /usr/share/nginx/html

ENV VIRTUAL_HOST=rillo5000.com

COPY . .
EXPOSE 80