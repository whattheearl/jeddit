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

## deploy: deploys to server 
.PHONY: deploy 
deploy: 
	./scripts/deploy.sh
