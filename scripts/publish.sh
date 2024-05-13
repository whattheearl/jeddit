VERSION=${1:-"latest"}
USER=whattheearl
PROJECT=jeddit

docker build -t ghcr.io/$USER/jeddit:latest -t ghcr.io/$USER/$PROJECT:$VERSION .
echo $GH_TOKEN | docker login ghcr.io -u $USER --password-stdin
docker push ghcr.io/$USER/$PROJECT:$VERSION
docker push ghcr.io/$USER/$PROJECT:latest
