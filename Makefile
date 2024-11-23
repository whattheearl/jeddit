# ==================================================================================== #
# VARIABLES 
# ==================================================================================== #

SERVER=wte
GIT_URL=https://github.com/whattheearl/jeddit
APP_PATH=/root/apps/jeddit
BUILD_PATH=/root/build/jeddit
TAG=ghcr.io/whattheearl/jeddit:latest

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
.PHONEY: format
format:
	@npx prettier --write .

# ==================================================================================== #
# DEVELOPMENT 
# ==================================================================================== #

## dev: starts dev server
.PHONEY: dev 
dev:
	npm i;
	npm run dev;

# ==================================================================================== #
# PUBLISH 
# ==================================================================================== #

## deploy: deploys to server 
.PHONEY: deploy 
deploy: no-dirty
	@echo "BUILDING CONTAINER" 
	ssh $SERVER git clone $GIT_URL $BUILD_PATH
	ssh $SERVER cd $BUILD_PATH && git pull
	ssh $SERVER cd $BUILD_PATH && docker build . --tag $TAG || exit 1

	@echo "PUSHING CONTAINER"
	ssh $SERVER docker push $TAG || exit 1

	@echo "PUSHING ENV"
	ssh $SERVER mkdir -p $APP_PATH || exit 1
	scp .env.prod $SERVER:$APP_PATH || exit 1
	scp docker-compose.yml $SERVER:$APP_PATH || exit 1

	@echo "RESTARTING SERVICE"
	ssh $SERVER "docker compose -f $APP_PATH/docker-compose.yml up -d"

