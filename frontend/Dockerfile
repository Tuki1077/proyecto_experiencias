FROM --platform=linux/amd64 node:16-alpine
WORKDIR /app/
COPY public/ /app/public
COPY src/ /app/src
COPY package*.json /app/
RUN yarn install
EXPOSE 3000
CMD ["yarn", "run", "start"]