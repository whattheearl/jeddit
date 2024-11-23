FROM node:22-alpine 
WORKDIR /app
ENV PORT=8080
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json package-lock.json ./
RUN npm install --verbose
COPY . .
RUN ./scripts/migrate.sh
RUN npm run build
ENTRYPOINT ["node", "./build/index.js"]
