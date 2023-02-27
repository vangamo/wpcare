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

# if __name__ == '__main__':
#   app.run(debug=True)


