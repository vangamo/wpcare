from src.db import Sites_DB, DatabaseConnException, DatabaseDataException

class SitesService:
  def __init__(self):
    print("Creating sites service")
    self.db = Sites_DB()



  def __getError(self, error):
    return {"info":{"success": False, "message": error}}, 404

  def __getListResult(self, data):
    return {"info":{"success": True}, "results": data}, 200

  def __getItemResult(self, data):
    message = {"info":{"success": True}, "result": data}
    if 'id' in data:
      message["info"]["id"] = data['id']
    return message, 200
  
  def __generateChangesResult(self, numChanges):
    if numChanges != 0:
      return {"info":{"success": True, "changes": numChanges}}, 200
    else:
      return {"info":{"success": False, "message": "No rows affected", "changes": numChanges}}, 200



  def get_all(self, auth=None):
    print("Sites.getAll")
    
    try:
      list = self.db.get_all()

      return self.__getListResult(list)
    except DatabaseConnException as ex:
      return self.__getError("Cannot connect to database ("+str(ex)+").")
    except DatabaseDataException as ex:
      return self.__getError(str(ex))
    except Exception as ex:
      if ex.__class__.__name__ == 'ProgrammingError':
        return self.__getError("Error in py/sql syntax ("+str(ex)+").")
      else:
        return self.__getError(ex.__class__.__name__+": Error while retrieving data ("+str(ex)+").")



  def get_one(self, id:int, auth=None):
    print("Sites.getOne")
    try:
      site = self.db.get_one(id)

      return self.__getItemResult(site)
    except DatabaseConnException as ex:
      return self.__getError("Cannot connect to database ("+str(ex)+").")
    except DatabaseDataException as ex:
      return self.__getError(str(ex))
    except Exception as ex:
      if ex.__class__.__name__ == 'ProgrammingError':
        return self.__getError("Error in py/sql syntax ("+str(ex)+").")
      else:
        return self.__getError(ex.__class__.__name__+": Error while retrieving data ("+str(ex)+").")



  def insert(self, data, auth=None):
    print("Sites.insert")
    try:
      site = self.db.create(data)

      return self.__getItemResult(site)
    except DatabaseConnException as ex:
      return self.__getError("Cannot connect to database ("+str(ex)+").")
    except DatabaseDataException as ex:
      return self.__getError(str(ex))
    except Exception as ex:
      if ex.__class__.__name__ == 'ProgrammingError':
        return self.__getError("Error in py/sql syntax ("+str(ex)+").")
      else:
        return self.__getError(ex.__class__.__name__+": Error while retrieving data ("+str(ex)+").")



  def update(self, id, data, auth=None):
    print("Sites.update")

    if type(data) is not dict:
      return self.__getError("Data is not an object.")
    
    if len(data.values()) == 0:
      return self.__getError("Data empty.")
    
    if type(data) is not dict:
      return self.__getError("Data is not an object.")

    try:
      changes = self.db.replace(id, data)

      return self.__generateChangesResult(changes['count'])
    except DatabaseConnException as ex:
      return self.__getError("Cannot connect to database ("+str(ex)+").")
    except DatabaseDataException as ex:
      return self.__getError(str(ex))
    except Exception as ex:
      if ex.__class__.__name__ == 'ProgrammingError':
        return self.__getError("Error in py/sql syntax ("+str(ex)+").")
      else:
        return self.__getError(ex.__class__.__name__+": Error while retrieving data ("+str(ex)+").")



  def delete(self, id, auth=None):
    print("Sites.delete")

    try:
      changes = self.db.delete(id)

      return self.__generateChangesResult(changes['count'])
    except DatabaseConnException as ex:
      return self.__getError("Cannot connect to database ("+str(ex)+").")
    except DatabaseDataException as ex:
      return self.__getError(str(ex))
    except Exception as ex:
      if ex.__class__.__name__ == 'ProgrammingError':
        return self.__getError("Error in py/sql syntax ("+str(ex)+").")
      else:
        return self.__getError(ex.__class__.__name__+": Error while retrieving data ("+str(ex)+").")
