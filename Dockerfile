# # pull official base image
FROM node:15.11.0 as build

# # set working directory
WORKDIR /app

COPY package.json package.json

RUN npm install --force

COPY . .

# Build the project and copy the files
RUN npm run build

# RUN npm run-script build

FROM nginx:1.17

COPY --from=build /app/build/ /usr/share/nginx/html
# RUN yarn install