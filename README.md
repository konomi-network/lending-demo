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
docker build -t asia.gcr.io/dev-env-312104/ui:v0.0.1 .
docker run --rm -p 80:80 asia.gcr.io/dev-env-312104/ui:v0.0.1
```