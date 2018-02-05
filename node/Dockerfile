FROM node:8

WORKDIR /src

RUN npm install -g nodemon jest

COPY . /src/
COPY start.sh /

RUN npm install

EXPOSE 1337

ENV NODE_ENV production

RUN chmod 755 /start.sh
CMD ["/start.sh"]
