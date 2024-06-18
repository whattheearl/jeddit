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
docker build . --tag $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION --platform linux/amd64

info "PUSHING CONTAINER"
docker push $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION 

info "PUSHING ENV"
ssh $IP mkdir -p /home/jon/jeddit
scp .env.prod $IP:/home/jon/jeddit/.env.prod

info "STOPPING CONTAINER"
ssh $IP docker stop $PROJECT

info "REMOVING CONTAINER"
ssh $IP docker rm $PROJECT

info "STARTING CONTAINER"
ssh $IP docker pull $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION
ssh $IP docker run \
    --restart unless-stopped \
    -p 5174:5174 \
    -d \
    --env-file /home/jon/jeddit/.env.prod \
    --name $CONTAINER_NAME $REGISTRY/$REGISTRY_USER/$CONTAINER_NAME:$VERSION
