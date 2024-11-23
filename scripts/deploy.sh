#!/bin/bash
SERVER=wte
GIT_URL=https://github.com/whattheearl/jeddit
BUILD_PATH=/root/build/jeddit
TAG=ghcr.io/whattheearl/jeddit:latest
APP_PATH=/root/apps/jeddit

green=$(tput setaf 2)
normal=$(tput sgr0)

function info {
  printf "${green}\n$1\n\n${normal}" 
}

info "BUILDING CONTAINER" 
ssh $SERVER git clone $GIT_URL $BUILD_PATH
ssh $SERVER cd $BUILD_PATH && git pull
ssh $SERVER cd $BUILD_PATH && docker build . --tag $TAG || exit 1

info "PUSHING CONTAINER"
ssh $SERVER docker push $TAG || exit 1

info "PUSHING ENV"
ssh $SERVER mkdir -p $APP_PATH || exit 1
scp .env.prod $SERVER:$APP_PATH || exit 1
scp docker-compose.yml $SERVER:$APP_PATH || exit 1

info "RESTARTING SERVICE"
ssh $SERVER "docker compose -f $APP_PATH/docker-compose.yml up -d"
