FROM node:22-alpine
RUN apk update && apk upgrade && apk add --no-cache sqlite
WORKDIR /home/jon/wte/jeddit
COPY package.json package-lock.json .
RUN npm ci --verbose
COPY . .
RUN ./scripts/migrate.sh
RUN npm run build
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PORT=8080
ENTRYPOINT ["node", "./build/index.js"]
