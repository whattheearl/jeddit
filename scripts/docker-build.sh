#!/bin/sh
BUILD_TAG=${1:-"jeddit:latest"}

docker build -t $BUILD_TAG .
