FROM oven/bun:alpine as builder
WORKDIR /temp/build
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json bun.lockb ./
RUN bun i
COPY . .
RUN bun run build
RUN bun run migrate

FROM oven/bun:alpine as runner
WORKDIR /app
ENV PORT=5173
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY --from=builder /temp/build/build .
COPY --from=builder /temp/build/db.sqlite .
CMD [ "bun", "--bun", "/app/index.js"]
