FROM node:alpine

WORKDIR /app
COPY package.json .
# RUN npm install --only=prod
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "start:prod"]