# lending-demo
This is the UI for konomi frontend. The backend is the substrate based parachain which you can find here: `https://github.com/konomi-network/cumulus`. The public url for konomi's parachain is at `wss://parachain.konomi.tech/parachain`, you can use polkadot js to try first.

## Build
For development, use the following command:
```bash
# Build
yarn install
```
Add the websocket connection to `config/development.json`, e.g.
```json
{
  "PROVIDER_SOCKET": "wss://parachain.konomi.tech/parachain"
}
```
Now, you can start the server with the command: `yarn start`.

## Using docker
```bash
# If you want to build the image locally
docker build -t konominetwork/ui:v0.1.0 .

docker run --rm -p 80:80 konominetwork/ui:v0.1.0
```