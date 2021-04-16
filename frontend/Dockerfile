FROM node:latest as build-stage
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY ./ .
RUN yarn build --prod

FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist/frontend /app
COPY nginx.conf /etc/nginx/nginx.conf
