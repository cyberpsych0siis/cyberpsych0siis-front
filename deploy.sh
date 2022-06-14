#!/bin/sh
docker stop frontend
docker rm frontend
docker build -t cyberpsych0siis-front .
docker run -d --name frontend --restart=always cyberpsych0siis-front