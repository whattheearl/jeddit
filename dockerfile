FROM oven/bun:alpine
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json bun.lockb ./
RUN bun i
COPY . .
RUN bun run build
ENV PORT=5173
RUN bun run migrate
CMD [ "bun", "--bun", "./build" ]
