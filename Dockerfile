FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# docker run -p 3000:3000 letmikuk

# update app
# docker build -t letmikuk .

# stop container
# docker ps
# docker stop <container_id>