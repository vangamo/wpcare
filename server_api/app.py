from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import src.db.db as db

# PGSQL_WPCARE_HOST=localhost PGSQL_WPCARE_DB=wpcare PGSQL_WPCARE_USER= PGSQL_WPCARE_PASSWORD= bin/flask --app app run --debug

app = Flask(__name__, static_url_path='', static_folder='static_react')
cors = CORS(app, resources={'/api/*': {'origins': '*'}})
api = Api(app)

@app.route('/')
def get_root():
  return 'Oh oh', 404

@app.route('/api/')
def get_api_root():
  return 'Site not created', 404

@app.route('/flask-health-check')
def check_flask_health_check():
  try:
    db.get_connection()
  except Exception as ex:
    return 'Error DB: '+str(ex), 503
  else:
    return 'Success', 200

class Site(Resource):
  def get(self, id:int=None):
    print(id)
    if id is None:
      sites = [
        {'id': 1, 'name': 'Python', 'url': 'https://python.org'},
        {'id': 2, 'name': 'React', 'url': 'https://reactjs.org/'}
      ]

      return sites, 200
    else:
      site = {'id': id, 'name': 'Python', 'url': 'https://python.org'}

      if site is not None:
        return site, 200
      
      else:
        return {"error": True, "message": "Site not found"}, 404

  def post(self, id:int=0):
    return 'Site not created', 404

  def put(self, id:int=0):
    return 'Site not updated', 404

  def delete(self, id:int=0):
    return 'Site not deleted', 404

api.add_resource(Site, "/api/sites/", "/api/site/", "/api/site/<int:id>", "/api/site/<int:id>/")

# if __name__ == '__main__':
#   app.run(debug=True)


