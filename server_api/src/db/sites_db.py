from .db import DB, DatabaseConnException, DatabaseDataException

class Sites_DB(DB):

  def get_all(self):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        SELECT id, name, url, type, created_at FROM sites
      ''')

    sites = []
    for row in cursor.fetchall():
      site = {
        "id": row[0],
        "name": row[1],
        "url": row[2],
        "type": row[3],
        "lastAccess": ( None if row[4] is None else row[4].isoformat() ),
      }
      sites.append( site )
    
    cursor.close()

    return sites



  def get_one(self, id):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        SELECT id, name, url, type, created_at FROM sites WHERE id=%s
      ''', [id])

    row = cursor.fetchone()
    if row is None:
      raise DatabaseDataException("No data with id "+str(id))

    site = {
      "id": row[0],
      "name": row[1],
      "url": row[2],
      "type": row[3],
      "lastAccess": ( None if row[4] is None else row[4].isoformat() ),
    }

    cursor.close()

    return site



  def create(self, data):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        INSERT
          INTO sites (name, url, type)
          VALUES (%s, %s, %s)
          RETURNING id, name, url, type, created_at
      ''', (data['name'], data['url'], data['type']))

    print(cursor.statusmessage)
    print(cursor.rowcount)
    print(cursor.lastrowid)
    print(cursor.query)
    print(cursor.rownumber)
    print(cursor.tzinfo_factory)
    row = cursor.fetchone()
    print(row)

    if cursor.rowcount == 0 or row[0] == 0:
      raise DatabaseDataException("Site not created (" + cursor.statusmessage + ")")

    site = {
      "id": row[0],
      "name": row[1],
      "url": row[2],
      "type": row[3],
      "lastAccess": ( None if row[4] is None else row[4].isoformat() ),
    }

    cursor.close()
    return site


  def replace(self, id, data):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    fields_chunk = ''
    values = []
    SEPARATOR = ''

    for field in ['name', 'url', 'type']:
      if field in data:
        fields_chunk += SEPARATOR+field+'=%s'
        values.append(data[field])
        SEPARATOR = ', '

    values.append(id)

    cursor = conn.cursor()
    cursor.execute(
      '''
        UPDATE sites
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
    return result



  def delete(self, id):
    conn = self.get_conection()
    if not conn:
      raise DatabaseConnException("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        DELETE
          FROM sites
          WHERE id IN (SELECT id
                         FROM sites
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
    return result
