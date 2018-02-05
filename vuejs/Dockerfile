FROM node:8

WORKDIR /src

COPY . /src/
COPY start.sh /

RUN npm i npm@6.4.0 -g

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

RUN chmod 755 /start.sh
CMD ["/start.sh"]
