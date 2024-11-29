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

## login: login to ghcr.io with GITHUB_TOKEN for publishing container 
.PHONY: login
login:
	@echo ${GITHUB_TOKEN} | docker login ghcr.io -u whattheearl --password-stdin

## build: build container ghcr.io/whattheearl/jeddit:latest
.PHONY: build
build:
	@docker build . --tag ghcr.io/whattheearl/jeddit:latest

## publish: publish docker container to ghcr.io/whattheearl/jeddit:latest
.PHONY: publish 
publish:
	@docker push ghcr.io/whattheearl/jeddit:latest

# ==================================================================================== #
# DEPLOYMENT
# ==================================================================================== #

## start: start service 
.PHONY: start 
start: 
	@docker compose up -d

## env: sync environmental variables
.PHONY: env
env:
	@ssh jeddit.wte.sh "rm -rf /home/jon/wte/jeddit; git clone https://github.com/whattheearl/jeddit /home/jon/wte/jeddit" || exit 1
	@scp .env.prod jeddit.wte.sh:/home/jon/wte/jeddit/.env.prod || exit 1
	@scp Makefile jeddit.wte.sh:/home/jon/wte/jeddit/Makefile || exit 1

## deploy: deploy service
# .PHONY: deploy
deploy: env
	@ssh jeddit.wte.sh "make -C /home/jon/wte/jeddit start"
