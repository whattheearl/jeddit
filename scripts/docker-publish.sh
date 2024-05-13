#!/bin/sh
VERSION=${1:-"latest"}
REGISTRY=ghcr.io
USER=whattheearl
PROJECT=jeddit
BUILD_TAG=jeddit

echo $GH_TOKEN | docker login $REGISTRY -u $USER --password-stdin
docker image tag $BUILD_TAG $REGISTRY/$USER/$PROJECT:$VERSION
docker push $REGISTRY/$USER/$PROJECT:$VERSION
