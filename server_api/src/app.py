from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from src.db import *
from src.services.sitesService import SitesService
from src.services.wpPluginsService import WPPluginsService

# PGSQL_WPCARE_HOST=localhost PGSQL_WPCARE_DB=wpcare PGSQL_WPCARE_USER= PGSQL_WPCARE_PASSWORD= bin/flask --app app run --debug

app = Flask(__name__, static_url_path='', static_folder='static_react')
api = Api(app)
#CORS(app, resources={'/api/*': {'origins': '*'}})
CORS(app)

sitesService = SitesService()
pluginsService = WPPluginsService()

@app.route('/')
def get_root():
  return 'Oh oh', 404

@app.route('/api/')
def get_api_root():
  return 'Site not created', 404

@app.route('/flask-health-check')
def check_flask_health_check():
  check_database()

class Site(Resource):
  def get(self, id:int=None):
    
    if id is None:
      response = sitesService.get_all()

      return response
    else:
      response = sitesService.get_one(id)

      return response

  def post(self):
    response = sitesService.insert(request.json)

    return response

  def put(self, id:int=0):
    response = sitesService.update(id, request.json)

    return response

  def delete(self, id:int=0):
    response = sitesService.delete(id)

    return response

api.add_resource(Site, "/api/sites/", "/api/site/", "/api/site/<int:id>", "/api/site/<int:id>/")


class WPPlugin(Resource):
  def get(self, id:int=None):
    
    if id is None:
      response = pluginsService.get_all()

      return response
    else:
      response = pluginsService.get_one(id)

      return response

  def post(self):
    response = pluginsService.insert(request.json)

    return response

  def put(self, id:int=0):
    response = pluginsService.update(id, request.json)

    return response

  def delete(self, id:int=0):
    response = pluginsService.delete(id)

    return response

api.add_resource(WPPlugin, "/api/plugins/", "/api/plugin/", "/api/plugin/<int:id>", "/api/plugin/<int:id>/")

# if __name__ == '__main__':
#   app.run(debug=True)


