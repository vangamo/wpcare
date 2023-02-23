from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS

# FLASK_ENV=development flask run --debugger

app = Flask(__name__, static_url_path='', static_folder='static_react')
cors = CORS(app, resources={'/api/*': {'origins': '*'}})
api = Api(app)

@app.route('/')
def get_root():
   return 'Oh oh', 404

@app.route('/api/')
def get_api_root():
   return 'Site not created', 404

# if __name__ == '__main__':
#   app.run(debug=True)


