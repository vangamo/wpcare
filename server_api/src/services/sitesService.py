import src.db.db as db

class SitesService:
  __conn__ = None

  @classmethod
  def get_conection(cls):
    if cls.__conn__ is None:
      try:
        cls.__conn__ = db.get_connection()
      except Exception as ex:
        print( ex )
        cls.__conn__ = None

    return cls.__conn__

  def __init__(self):
    print("Creating sites service")


  def __getError(self, error):
    return {"error": True, "message": error}, 404


  def get_all(self, auth=None):
    print("Sites.getAll")
      
    conn = self.get_conection()
    if not conn:
      return self.__getError("Cannot connect to database.")
    
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
        "type": row[2],
        "lastAccess": ( None if row[4] is None else row[4].isoformat() ),
      }
      sites.append( site )

    cursor.close()
    return sites, 200


  def get_one(self, id:int, auth=None):
    print("Sites.getOne")

    conn = self.get_conection()
    if not conn:
      return self.__getError("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        SELECT id, name, url, type, created_at FROM sites WHERE id=%s
      ''', [id])

    row = cursor.fetchone()
    if row is None:
      return {}, 200

    site = {
      "id": row[0],
      "name": row[1],
      "url": row[2],
      "type": row[2],
      "lastAccess": ( None if row[4] is None else row[4].isoformat() ),
    }

    cursor.close()
    return site, 200


  def insert(self, data, auth=None):
    print("Sites.insert")

    conn = self.get_conection()
    if not conn:
      return self.__getError("Cannot connect to database.")
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        INSERT
          INTO sites (name, url, type)
          VALUES (%s, %s, %s)
          RETURNING id
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
      return {"success": False}, 200


    result = {"success": (cursor.rowcount == 0 or row[0] == 0), "id": row[0] == 0, "result": {"id": row[0], **data}}
    print(result)

    
    cursor.close()
    return result, 200


  def update(self, id, data, auth=None):
    print("Sites.update")

    if type(data) is not dict:
      return self.__getError("Data is not an object.")
    
    if len(data.values()) == 0:
      return self.__getError("Data empty.")
    
    if type(data) is not dict:
      return self.__getError("Data is not an object.")

    conn = self.get_conection()
    if not conn:
      return self.__getError("Cannot connect to database.")
    
    print(data)

    fields_chunk = ''
    values = []
    SEPARATOR = ''

    for field in ['name', 'url', 'type']:
      if field in data:
        fields_chunk += field+'=%s'+SEPARATOR
        values.append(data[field])
        SEPARATOR = ', '

    values.append(id)

    print(
      '''
        UPDATE sites
        SET ''' + fields_chunk + '''
        WHERE id=%s
      '''
    )
    
    cursor = conn.cursor()
    cursor.execute(
      '''
        UPDATE sites
        SET ''' + fields_chunk + '''
        WHERE id=%s
      ''', (values))

    result = cursor.rowcount
    print(result)
    cursor.close()

    if result != 1:
      return {"result": True, "updated": result}, 200

    return {"result": True, "updated": result}, 200


  def delete(self, id, auth=None):
    print("Sites.delete")

    conn = self.get_conection()
    if not conn:
      return self.__getError("Cannot connect to database.")
    
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

    result = cursor.rowcount
    print(result)
    cursor.close()

    if result != 1:
      return {"result": True, "deleted": result}, 200

    return {"result": True, "deleted": result}, 200