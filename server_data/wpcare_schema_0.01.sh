#!/bin/sh
psql -v ON_ERROR_STOP=1 --username "${PGSQL_WPCARE_USER}" --dbname "${PGSQL_WPCARE_DB}" <<-EOSQL
	CREATE TABLE sites (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    key VARCHAR(32) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL,
    comments_enabled BOOL,
    version_wp VARCHAR(12),
    version_php VARCHAR(12),
    version_mysql VARCHAR(12),
    php_time_limit SMALLINT,
    php_mem_limit SMALLINT,
    php_post_limit SMALLINT,
    domain_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMP,
    updated_by INTEGER,
    deleted_at TIMESTAMP,
    deleted_by INTEGER,
    PRIMARY KEY (id)
  );
EOSQL