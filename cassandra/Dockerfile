FROM cassandra:2.2.9

COPY custom-docker-entrypoint.sh /custom-docker-entrypoint.sh
COPY migrate.cql /migrate.cql
ENTRYPOINT ["/custom-docker-entrypoint.sh"]

CMD ["cassandra", "-f"]