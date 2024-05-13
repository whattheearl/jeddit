#!/bin/sh
IP=blackbox.wte.sh
REGISTRY=ghcr.io
REGISTRY_USER=whattheearl
IMAGE=jeddit:latest
CONTAINER_NAME=jeddit

green=$(tput setaf 2)
normal=$(tput sgr0)

function printG {
  printf "${green}\n$1\n\n\n${normal}" 
}

printG "BUILDING CONTAINER" 
docker build . --tag jeddit --platform linux/amd64

printG "PUSHING CONTAINER"
docker save jeddit:latest | ssh $IP docker load

printG "PUSHING ENV"
ssh $IP mkdir -p /home/jon/jeddit
scp .env.prod $IP:/home/jon/jeddit/.env.prod

printG "STOPPING CONTAINER"
ssh $IP docker stop jeddit

printG "REMOVING CONTAINER"
ssh $IP docker rm jeddit

printG "STARTING CONTAINER"
ssh $IP docker pull $REGISTRY/$REGISTRY_USER/$IMAGE
ssh $IP docker run \
    --restart unless-stopped \
    -p 5174:5174 \
    -d \
    --env-file /home/jon/jeddit/.env.prod \
    --name $CONTAINER_NAME $REGISTRY/$REGISTRY_USER/$IMAGE
    


