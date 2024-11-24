#!/usr/bin/env bash 
SERVER="wte"
GIT_PATH="/root/git/jeddit"
BUILD_PATH="/root/build/jeddit"
TAG="ghcr.io/whattheearl/jeddit:latest"
APP_PATH="/root/app/jeddit"

# echo "PUSHING REPOSITORY ssh://${SERVER}:${GIT_PATH}\n" 
# git push "ssh://${SERVER}:${GIT_PATH}"

echo "CHECKOUT REPOSITORY ${GIT_PATH}"
rm -rf ${BUILD_PATH}
git clone -b main ${GIT_PATH} ${BUILD_PATH}

echo "BUILDING CONTAINER ${TAG}"
cd ${BUILD_PATH} 
docker build . --tag ${tag}
# ssh ${SERVER} "rm -rf ${BUILD_PATH}"
# ssh ${SERVER} "git clone -b main ${GIT_PATH} ${BUILD_PATH}"
# ssh ${SERVER} "cd ${BUILD_PATH} && docker build . --tag ${TAG}"
#
echo "PUSHING CONTAINER"
docker push ${TAG}
# ssh ${SERVER} "docker push ${TAG}"
#
# echo "PUSHING ENV"
# ssh ${SERVER} "mkdir -p ${APP_PATH}"
# scp .env.prod "${SERVER}:${APP_PATH}"
# scp docker-compose.yml "${SERVER}:$APP_PATH"
#
echo "RESTARTING SERVICE"
# ssh ${SERVER} "docker compose -f ${APP_PATH}/docker-compose.yml up -d"
docker compose -f ${BUILD_PATH}/docker-compose.yml up -d
