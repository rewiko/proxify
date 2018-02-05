CREATE KEYSPACE IF NOT EXISTS users WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1 };
CREATE TABLE IF NOT EXISTS users.locks (name text PRIMARY KEY, client text);
