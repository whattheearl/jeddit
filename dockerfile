FROM oven/bun:alpine
COPY package.json bun.lockb ./
RUN bun i
COPY . .
RUN bun run build
ENV PORT=5173
EXPOSE $PORT
CMD [ "bun", "--bun", "./build" ]
