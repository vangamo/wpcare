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
    --FOREIGN KEY (id) REFERENCES siteswp (id) ON UPDATE CASCADE ON DELETE NO ACTION
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT siteswp_updated_pkey PRIMARY KEY (id),
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
    --FOREIGN KEY (id) REFERENCES siteswp (id) ON UPDATE CASCADE ON DELETE NO ACTION
    deleted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT siteswp_deleted_pkey PRIMARY KEY (id),
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
    --FOREIGN KEY (id) REFERENCES wp_plugins (id) ON UPDATE CASCADE ON DELETE NO ACTION
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT wp_plugins_updated_pkey PRIMARY KEY (id),
    CONSTRAINT wp_plugins_updated_id_fkey FOREIGN KEY (sitewp_id)
        REFERENCES siteswp (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS wp_plugins_deleted
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
    --FOREIGN KEY (id) REFERENCES wp_plugins (id) ON UPDATE CASCADE ON DELETE NO ACTION
    deleted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_by INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT wp_plugins_deleted_pkey PRIMARY KEY (id),
    CONSTRAINT wp_plugins_deleted_id_fkey FOREIGN KEY (sitewp_id)
        REFERENCES siteswp (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
  );
  INSERT INTO wp_plugins (sitewp_id, slug, name, active, version, author, author_uri, plugin_uri, wp_req_version, wp_min_version, wp_tested_version, php_req_version, data) VALUES (3, 'worker', 'ManageWP - Worker', true, '4.9.16', 'GoDaddy', 'https://godaddy.com', 'https://managewp.com', null, null, null, null, '{"Plugin Starter":"worker/init.php","Plugin Slug":"worker","Plugin Name":"ManageWP - Worker","Plugin URI":"https://managewp.com","Description":"We help you efficiently manage all your WordPress websites. <strong>Updates, backups, 1-click login, migrations, security</strong> and more, on one dashboard. This service comes in two versions:standalone <a href=\"https://managewp.com\">ManageWP</a> service that focuses on website management, and <a href=\"https://godaddy.com/pro\">GoDaddy Pro</a> that includes additional tools for hosting, client management, lead generation, and more.","Version":"4.9.16","Author":"GoDaddy","Author URI":"https://godaddy.com","License":"GPL2","Text Domain":"worker","Network":"true"}');

  --SELECT name, data->'Plugin URI' FROM wp_plugins;
EOSQL