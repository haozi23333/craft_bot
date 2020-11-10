FROM node:13.8.0-alpine3.10

WORKDIR /app
COPY ["package.json", "./"]
RUN npm i

COPY . .
RUN npm run build
CMD ["node", "app.js"]