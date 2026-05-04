FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN mkdir -p uploads

CMD ["npm", "run", "start:scheduler"]
