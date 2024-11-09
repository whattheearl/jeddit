FROM node:22-alpine AS builder
WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
RUN npm run migrate
CMD [ "node", "/app/build/index.js"]

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=builder /app/build /app/build
COPY --from=builder /app/data /app/data
CMD [ "node", "/app/build/index.js"]
