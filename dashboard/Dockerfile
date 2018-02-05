FROM node:8.6-alpine

RUN apk add --no-cache bash && \
  mkdir -p /datasources /dashboards && \
  npm install -g wizzy@0.5.9

COPY entrypoint.sh /entrypoint.sh

RUN chmod 755 /entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
