FROM nginx
WORKDIR /usr/share/nginx/html

ENV VIRTUAL_HOST cyberpsych0si.is

COPY . .
EXPOSE 80