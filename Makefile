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

## env: sync environmental variables
.PHONY: env
env:
	@ssh wte "rm -rf /home/jon/wte/jeddit; git clone -b main /root/git/jeddit /home/jon/wte/jeddit"
	@rsync .env.prod		wte:/home/jon/wte/jeddit/.env.prod
	@rsync docker-compose.yml	wte:/home/jon/wte/jeddit/docker-compose.yml
	@rsync Makefile			wte:/home/jon/wte/jeddit/Makefile

## build: build container ghcr.io/whattheearl/jeddit:latest
.PHONY: build
build:
	@docker build /home/jon/wte/jeddit --tag ghcr.io/whattheearl/jeddit:latest

## push: publish container to ghcr.io/whattheearl/jeddit:latest
.PHONY: publish
push:
	@docker push ghcr.io/whattheearl/jeddit:latest

## start: start service 
.PHONY: start 
start: build push
	@docker compose -f /home/jon/wte/jeddit/docker-compose.yml up -d
	
# ## deploy: deploy service
# .PHONY: deploy
deploy: env
	@ssh wte "make --file /home/jon/wte/jeddit/Makefile start"
