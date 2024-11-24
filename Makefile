# ==================================================================================== #
# VARIABLES 
# ==================================================================================== #

SERVER=wte
GIT_URL=https://github.com/whattheearl/jeddit
BUILD_PATH=/root/build/jeddit
TAG=jeddit:local
APP_PATH=/root/app/jeddit

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@echo ${MAKEFILE_LIST}
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure [y/N]' && read ans && [ $${ans:-N} = y ]

.PHONY: no-dirty
no-dirty:
	@test -z "$(shell git status --porcelain)"

# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## format: format files
.PHONY: format
format:
	@npx prettier --write .

# ==================================================================================== #
# DEVELOPMENT 
# ==================================================================================== #

## dev: starts dev server
.PHONY: dev 
dev:
	npm i;
	npm run dev;

# ==================================================================================== #
# PUBLISH 
# ==================================================================================== #

## docker-push: build and push latest container
.PHONY: docker-push
docker-push:
	@echo "CLONING REPOSITORY" 
	@git push ssh://${SERVER}:/root/git/jeddit
	@ssh ${SERVER} "rm -rf ${BUILD_PATH}"
	@ssh ${SERVER} "git clone -b main /root/git/jeddit ${BUILD_PATH} || exit 1"

	@echo "BUILDING CONTAINER"
	@ssh $SERVER "cd ${BUILD_PATH} && docker build . --tag ${TAG} || exit 1"

	@echo "PUSHING CONTAINER"
	@ssh $SERVER docker push $TAG || exit 1

## env-push: push env
.PHONY: env-push
	@echo "PUSHING ENV"
	@ssh $SERVER "mkdir -p $APP_PATH || exit 1"
	@scp .env.prod $SERVER:$APP_PATH || exit 1
	@scp docker-compose.yml $SERVER:$APP_PATH || exit 1

## deploy: deploys to server 
.PHONY: deploy 
deploy: no-dirty docker-push env-push
	@echo "RESTARTING SERVICE"
	@ssh $SERVER "docker compose -f ${APP_PATH}/docker-compose.yml down"

