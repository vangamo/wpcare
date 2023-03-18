#!/bin/sh
psql -v ON_ERROR_STOP=1 --username "${PGSQL_WPCARE_USER}" --dbname "${PGSQL_WPCARE_DB}" <<-EOSQL
	CREATE TABLE sites (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
  );
  CREATE TABLE sites_updated (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL UNIQUE,
    updated_at TIMESTAMP,
    updated_by INTEGER
    --FOREIGN KEY (id) REFERENCES sites (id) ON UPDATE CASCADE ON DELETE NO ACTION
  );
  CREATE TABLE sites_deleted (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL UNIQUE,
    deleted_at TIMESTAMP,
    deleted_by INTEGER
    --FOREIGN KEY (id) REFERENCES sites (id) ON UPDATE CASCADE ON DELETE NO ACTION
  );
	CREATE TABLE sites_wp (
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
    FOREIGN KEY (id) REFERENCES sites (id) ON UPDATE CASCADE ON DELETE CASCADE
  );
  INSERT INTO sites (name, url, type) VALUES ('Python','https://www.python.org/','web');
  INSERT INTO sites (name, url, type) VALUES ('Preact','https://preactjs.com/','web');
  INSERT INTO sites (name, url, type) VALUES ('Wordpress news','https://wordpress.org/news/','wp');

  CREATE TABLE config (
    key VARCHAR(32) NOT NULL,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (key)
  );

  INSERT INTO config (key, value, created_by) VALUES ('version', '0.1.1', 0);
EOSQL