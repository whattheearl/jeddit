#!/usr/bin/env bash 
SERVER=wte
GIT_URL=https://github.com/whattheearl/jeddit
BUILD_PATH=/root/build/jeddit
TAG=jeddit:local
APP_PATH=/root/app/jeddit

green=$(tput setaf 2)
normal=$(tput sgr0)

function info {
  printf "${green}\n$1\n\n${normal}" 
}

info "CLONING REPOSITORY" 
git push ssh://${SERVER}:/root/git/jeddit
ssh ${SERVER} rm -rf ${BUILD_PATH}
ssh ${SERVER} git clone /root/git/jeddit ${BUILD_PATH} || exit 1

info "BUILDING CONTAINER"
ssh $SERVER cd ${BUILD_PATH} && docker build . --tag ${TAG} || exit 1

# info "PUSHING CONTAINER"
# ssh $SERVER docker push $TAG || exit 1

info "PUSHING ENV"
ssh $SERVER mkdir -p $APP_PATH || exit 1
scp .env.prod $SERVER:$APP_PATH || exit 1
scp docker-compose.yml $SERVER:$APP_PATH || exit 1

info "RESTARTING SERVICE"
ssh $SERVER "docker compose -f ${APP_PATH}/docker-compose.yml down"
ssh $SERVER "docker compose -f ${APP_PATH}/docker-compose.yml pull"
ssh $SERVER "docker compose -f ${APP_PATH}/docker-compose.yml up -d"
