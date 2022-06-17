#!/bin/sh
docker stop frontend
docker rm frontend
docker build -t cyberpsych0siis-front .
docker run -d --name frontend --restart=always -v $(pwd):/usr/share/nginx/html cyberpsych0siis-front