#!/bin/bash
ip=jon@blackbox
green=$(tput setaf 2)
normal=$(tput sgr0)

function printG {
  printf "${green}\n$1\n\n\n${normal}" 
}

printG "BUILDING CONTAINER" 
docker build . --tag jeddit --platform linux/amd64

printG "PUSHING CONTAINER"
docker save jeddit:latest | ssh $ip docker load

printG "PUSHING ENV"
ssh $ip mkdir -p /home/jon/jeddit
scp .env.prod $ip:/home/jon/jeddit/.env.prod

printG "STOPPING CONTAINER"
ssh $ip docker stop jeddit

printG "REMOVING CONTAINER"
ssh $ip docker rm jeddit

printG "STARTING CONTAINER"
ssh $ip docker run \
    --restart unless-stopped \
    -p 5174:5174 \
    -d \
    --env-file /home/jon/jeddit/.env.prod \
    --name jeddit jeddit:latest
    


