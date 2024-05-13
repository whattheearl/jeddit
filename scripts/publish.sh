VERSION=${1:-"latest"}

docker build -t ghcr.io/whattheearl/jeddit:latest -t ghcr.io/whattheearl/jeddit:$VERSION .
echo $GH_TOKEN | docker login ghcr.io -u whattheearl --password-stdin
docker push ghcr.io/whattheearl/jeddit --all-tags
