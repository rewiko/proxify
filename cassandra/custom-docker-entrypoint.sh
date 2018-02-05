#!/bin/bash

# Preventing the parent docker-entrypoint script from launching Cassandra
sed -i 's/exec "$@"//g' /docker-entrypoint.sh
# Run parent docker-entyrypoint script to ensure Cassandra config and environment variables are set correctly
/docker-entrypoint.sh "$@"

# Based off https://stackoverflow.com/questions/32254497/create-keyspace-automatically-inside-docker-container-with-cassandra
# Attempts to run migrate.cql in the background process, allowing us to continue to start Cassandra.
until cqlsh -f "/migrate.cql"; do >&2 echo "Cassandra is unavailable - sleeping"; sleep 2; done &
exec "$@"

