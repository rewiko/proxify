#!/bin/sh

host="cockroach"

./cockroach sql --insecure --host="$host" --execute="  DROP USER IF EXISTS cockroach; \
                                        DROP DATABASE IF EXISTS $1 CASCADE; \
                                        CREATE DATABASE IF NOT EXISTS $1; \
                                        CREATE USER cockroach WITH PASSWORD 'password'; \
                                        GRANT ALL ON DATABASE $1 TO cockroach;"
