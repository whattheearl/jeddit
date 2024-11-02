FROM node:22-alpine
WORKDIR /app
ENV PORT=5173
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
RUN npm run migrate
CMD [ "node", "/app/build/index.js"]
