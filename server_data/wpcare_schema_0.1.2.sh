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
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL UNIQUE,
    updated_at TIMESTAMP,
    updated_by INTEGER
    --FOREIGN KEY (id) REFERENCES sites (id) ON UPDATE CASCADE ON DELETE NO ACTION
  );
  CREATE TABLE sites_deleted (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL UNIQUE,
    deleted_at TIMESTAMP,
    deleted_by INTEGER
    --FOREIGN KEY (id) REFERENCES sites (id) ON UPDATE CASCADE ON DELETE NO ACTION
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

  INSERT INTO config (key, value, created_by) VALUES ('version', '0.1.2', 0);

  CREATE TABLE IF NOT EXISTS siteswp
  (
    id INTEGER NOT NULL,
    title varchar(255) NOT NULL,
    wp_version varchar(16),
    php_version varchar(16),
    admin_email varchar(64),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT siteswp_pkey PRIMARY KEY (id),
    CONSTRAINT siteswp_id_fkey FOREIGN KEY (id)
        REFERENCES sites (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS siteswp_updated
  (
    id INTEGER NOT NULL,
    title varchar(255) NOT NULL,
    wp_version varchar(16),
    php_version varchar(16),
    admin_email varchar(64),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER NOT NULL DEFAULT 1,
    --CONSTRAINT siteswp_updated_pkey PRIMARY KEY (id),
    --FOREIGN KEY (id) REFERENCES siteswp (id) ON UPDATE CASCADE ON DELETE NO ACTION
    CONSTRAINT siteswp_updated_id_fkey FOREIGN KEY (id)
        REFERENCES sites (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS siteswp_deleted
  (
    id INTEGER NOT NULL,
    title varchar(255) NOT NULL,
    wp_version varchar(16),
    php_version varchar(16),
    admin_email varchar(64),
    deleted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_by INTEGER NOT NULL DEFAULT 1,
    --CONSTRAINT siteswp_deleted_pkey PRIMARY KEY (id),
    --FOREIGN KEY (id) REFERENCES siteswp (id) ON UPDATE CASCADE ON DELETE NO ACTION
    CONSTRAINT siteswp_deleted_id_fkey FOREIGN KEY (id)
        REFERENCES sites (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  INSERT INTO siteswp (id, title, wp_version, php_version) VALUES (3, '', '', '7.3');

  CREATE TABLE IF NOT EXISTS wp_plugins
  (
    id SERIAL NOT NULL,
    sitewp_id integer NOT NULL,
    slug varchar(64) NOT NULL,
    name varchar(255) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    version varchar(16),
    author varchar(255),
    author_uri varchar(255),
    plugin_uri varchar(255),
    wp_req_version varchar(16),
    wp_min_version varchar(16),
    wp_tested_version varchar(16),
    php_req_version varchar(16),
    data json NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT wp_plugins_pkey PRIMARY KEY (id),
    CONSTRAINT wp_plugins_id_fkey FOREIGN KEY (sitewp_id)
        REFERENCES siteswp (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS wp_plugins_updated
  (
    id INTEGER NOT NULL,
    sitewp_id integer NOT NULL,
    slug varchar(64) NOT NULL,
    name varchar(255) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    version varchar(16),
    author varchar(255),
    author_uri varchar(255),
    plugin_uri varchar(255),
    wp_req_version varchar(16),
    wp_min_version varchar(16),
    wp_tested_version varchar(16),
    php_req_version varchar(16),
    data json NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER NOT NULL DEFAULT 1,
    --CONSTRAINT wp_plugins_updated_pkey PRIMARY KEY (id),
    --FOREIGN KEY (id) REFERENCES wp_plugins (id) ON UPDATE CASCADE ON DELETE NO ACTION
    CONSTRAINT wp_plugins_updated_id_fkey FOREIGN KEY (sitewp_id)
        REFERENCES siteswp (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS wp_plugins_deleted
  (
    id INTEGER NOT NULL,
    sitewp_id integer NOT NULL,
    slug varchar(64) NOT NULL,
    name varchar(255) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    version varchar(16),
    author varchar(255),
    author_uri varchar(255),
    plugin_uri varchar(255),
    wp_req_version varchar(16),
    wp_min_version varchar(16),
    wp_tested_version varchar(16),
    php_req_version varchar(16),
    data json NOT NULL DEFAULT '{}',
    deleted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_by INTEGER NOT NULL DEFAULT 1,
    --CONSTRAINT wp_plugins_deleted_pkey PRIMARY KEY (id),
    --FOREIGN KEY (id) REFERENCES wp_plugins (id) ON UPDATE CASCADE ON DELETE NO ACTION
    CONSTRAINT wp_plugins_deleted_id_fkey FOREIGN KEY (sitewp_id)
        REFERENCES siteswp (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );

  --SELECT name, data->'Plugin URI' FROM wp_plugins;
EOSQL