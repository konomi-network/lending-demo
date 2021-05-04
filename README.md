# lending-demo

## Build and run

Build:
```bash
yarn install
```

Run:
```bash
yarn start
```

## Using docker
```bash
docker build -t konomi-ui:latest .
docker build -t asia.gcr.io/ivory-vim-300504/ui:v0.0.10 .
docker run --rm -p 80:80 konomi-ui:latest
```