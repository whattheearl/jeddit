FROM node:22-alpine 
WORKDIR /app
ENV PORT=8080
RUN mkdir -p /app/data
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
ENTRYPOINT ["/bin/sh", "/app/scripts/entrypoint.sh"]
