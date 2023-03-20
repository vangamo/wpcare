from .db import DB, DatabaseConnException, DatabaseDataException
import json

class WPPlugins_DB(DB):

  def get_all(self):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      #          0     1      2         3         4          5           6            7                  8
      #     9                  10                    11           12        13          14      15
      '''
        SELECT p.id, p.name, p.slug, p.active, p.version, p.author, p.author_uri, p.plugin_uri, p.wp_req_version, p.wp_min_version, p.wp_tested_version, p.php_req_version, p.data, p.created_at, s.name, s.url
          FROM wp_plugins p
            JOIN siteswp wp ON (p.sitewp_id=wp.id)
            JOIN sites s ON (s.type='wp' AND wp.id=s.id)
      ''')

    plugins = []
    for row in cursor.fetchall():
      plugin = {
        "id": row[0],
        "name": row[1],
        "slug": row[2],
        "active": row[3],
        "version": row[4],
        "author": row[5],
        "author_uri": row[6],
        "plugin_uri": row[7],
        "wp_req_version": row[8],
        "wp_min_version": row[9],
        "wp_tested_version": row[10],
        "php_req_version": row[11],
        "data": row[12],
        "lastAccess": ( None if row[13] is None else row[13].isoformat() ),
        "site_name": row[14],
        "site_url": row[15]
      }
      plugins.append( plugin )
    
    cursor.close()

    return plugins



  def get_one(self, id):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        SELECT p.id, p.name, p.slug, p.active, p.version, p.author, p.author_uri, p.plugin_uri, p.wp_req_version, p.wp_min_version, p.wp_tested_version, p.php_req_version, p.data, p.created_at, s.name, s.url
          FROM wp_plugins p
            JOIN siteswp wp ON (p.sitewp_id=wp.id)
          	JOIN sites s ON (s.type='wp' AND wp.id=s.id)
          WHERE p.id=%s
      ''', [id])

    row = cursor.fetchone()
    if row is None:
      raise DatabaseDataException("No data with id "+str(id))

    plugin = {
      "id": row[0],
      "name": row[1],
      "slug": row[2],
      "active": row[3],
      "version": row[4],
      "author": row[5],
      "author_uri": row[6],
      "plugin_uri": row[7],
      "wp_req_version": row[8],
      "wp_min_version": row[9],
      "wp_tested_version": row[10],
      "php_req_version": row[11],
      "data": row[12],
      "lastAccess": ( None if row[13] is None else row[13].isoformat() ),
      "site_name": row[14],
      "site_url": row[15]
    }

    cursor.close()

    return plugin



  def create(self, data):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    try:
      cursor.execute(
        '''
          INSERT
            INTO wp_plugins (sitewp_id, name, slug, active, version, author, author_uri, plugin_uri, wp_req_version, wp_min_version, wp_tested_version, php_req_version, data)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, slug, active, version, author, author_uri, plugin_uri, wp_req_version, wp_min_version, wp_tested_version, php_req_version, data, created_at, sitewp_id
        ''', (data['sitewp_id'], data['name'], data['slug'], data['active'], data['version'], data['author'], data['author_uri'], data['plugin_uri'], data['wp_req_version'], data['wp_min_version'], data['wp_tested_version'], data['php_req_version'], json.dumps(data['data'])))

      print(cursor.statusmessage)
      print(cursor.rowcount)
      print(cursor.lastrowid)
      print(cursor.query)
      print(cursor.rownumber)
      print(cursor.tzinfo_factory)
      row = cursor.fetchone()
      print(row)

      if cursor.rowcount == 0 or row[0] == 0:
        raise DatabaseDataException("Plugin not created (" + cursor.statusmessage + ")")

      plugin = {
        "id": row[0],
        "name": row[1],
        "slug": row[2],
        "active": row[3],
        "version": row[4],
        "author": row[5],
        "author_uri": row[6],
        "plugin_uri": row[7],
        "wp_req_version": row[8],
        "wp_min_version": row[9],
        "wp_tested_version": row[10],
        "php_req_version": row[11],
        "data": row[12],
        "lastAccess": ( None if row[13] is None else row[13].isoformat() ),
        "site_id": row[14]
      }

      cursor.close()
      conn.commit()

      return plugin

    except Exception as ex:
      print('Closing connection')
      cursor.close()
      raise ex


  def replace(self, id, data):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    fields_chunk = ''
    values = []
    SEPARATOR = ''

    for field in ['sitewp_id', 'slug', 'name', 'active', 'version', 'author', 'author_uri', 'plugin_uri', 'wp_req_version', 'wp_min_version', 'wp_tested_version', 'php_req_version', 'data']:
      if field in data:
        fields_chunk += SEPARATOR+field+'=%s'
        values.append(data[field])
        SEPARATOR = ', '

    values.append(id)

    cursor = conn.cursor()
    cursor.execute(
      '''
        UPDATE wp_plugins
        SET ''' + fields_chunk + '''
        WHERE id=%s
        RETURNING id
      ''', (values))

    print(cursor.statusmessage)
    print(cursor.rowcount)
    print(cursor.lastrowid)
    print(cursor.query)
    print(cursor.rownumber)
    print(cursor.tzinfo_factory)
    row = cursor.fetchone()
    print(row)

    result = {'count': cursor.rowcount, 'id': row[0]}
    
    cursor.close()
    conn.commit()

    return result



  def delete(self, id):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        DELETE
          FROM wp_plugins
          WHERE id IN (SELECT id
                         FROM wp_plugins
                         WHERE id=%s
                         LIMIT 1)
          RETURNING id
      ''', [id])

    print(cursor.statusmessage)
    print(cursor.rowcount)
    print(cursor.lastrowid)
    print(cursor.query)
    print(cursor.rownumber)
    print(cursor.tzinfo_factory)
    row = cursor.fetchone()
    print(row)

    result = {'count': cursor.rowcount, 'id': row[0]}
    
    cursor.close()
    conn.commit()

    return result
