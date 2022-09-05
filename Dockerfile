FROM node:16-alpine

WORKDIR /app

COPY package.json ./

ENV NODE_ENV production

RUN npm install
RUN npm install react-scripts -g
RUN npm install serve -g

COPY . ./

ENV API_URL backend.io
ENV API_PORT 8080
ENV PORT 3000

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]