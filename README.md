# Jeddit

### todo:

-   [eslint] ignore ui library files
-   [eslint] ignore excalidraw for now (kinda hacky anyways)
-   [eslint] html error (maybe move to ast html abstraction)
-   [images] extract db/sharp code
-   [diagrams] inject / edit excalidraw
-   [image] load by screensize
-   [postlist] auto title image
-   [comment] emoji / image
-   [comment] comments

## Dev

```bash
nvm use --lts
npm i
npm run migrate
npm run dev
# goto http://localhost:5173
```

## Run

```bash
npm i
npm run migrate
npm run build
node ./build
# goto http://localhost:5173
```

## Deploy

```bash
/bin/bash ./scripts/deploy.sh
```
