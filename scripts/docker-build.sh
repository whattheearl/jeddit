BUILD_TAG=${1:-"jeddit"}

docker build -t $BUILD_TAG .
