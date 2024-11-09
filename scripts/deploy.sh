#!/bin/bash
IP=blackbox.wte.sh
PROJECT=jeddit
REGISTRY=ghcr.io
REGISTRY_USER=whattheearl
CONTAINER_NAME=jeddit
VERSION=latest

green=$(tput setaf 2)
normal=$(tput sgr0)

function info {
  printf "${green}\n$1\n\n\n${normal}" 
}

info "BUILDING CONTAINER" 
docker build . --tag $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION --platform linux/amd64 || exit 1


info "PUSHING CONTAINER"
docker push $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION || exit 1

info "PUSHING ENV"
ssh $IP mkdir -p jeddit 
scp .env.prod $IP:jeddit/.env.prod
scp docker-compose.yml $IP:jeddit/docker-compose.yml

info "PULLING CONTAINER"
ssh $IP cd jeddit; docker compose pull; 

info "RESTARTING CONTAINER"
ssh $IP cd jeddit; docker compose up -d; 
