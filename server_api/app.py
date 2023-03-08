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

import pycurl
import certifi
from io import BytesIO
import re

@app.route('/api/sites/<int:id>/sitemap')
def get_sitemap(id:int=None):
  url = 'https://books.adalab.es/materiales-del-curso-s/s8H2ymn81SElmPsxNXc6/'
  # url = 'https://nucep.com'
  # Creating a buffer as the cURL is not allocating a buffer for the network response
  buffer = BytesIO()
  c = pycurl.Curl()
  #initializing the request URL
  c.setopt(c.URL, url)
  #setting options for cURL transfer  
  c.setopt(c.WRITEDATA, buffer)
  c.setopt(c.CAINFO, certifi.where())
  c.setopt(c.FOLLOWLOCATION, True)
  c.setopt(c.VERBOSE, True)
  # perform file transfer
  c.perform()

  print('Holis')

  # Figure out what encoding was sent with the response, if any.
  # Check against lowercased header name.
  headers = {}
  encoding = None
  if 'content-type' in headers:
      content_type = headers['content-type'].lower()
      match = re.search('charset=(\S+)', content_type)
      if match:
          encoding = match.group(1)
          print('Decoding using %s' % encoding)
  if encoding is None:
      # Default encoding for HTML is iso-8859-1.
      # Other content types may have different default encoding,
      # or in case of binary data, may have no encoding at all.
      encoding = 'utf-8'
      print('Assuming encoding is %s' % encoding)

  body = buffer.getvalue()
  # Decode using the encoding we figured out.
  print(body.decode(encoding))
        
  #retrieve the content BytesIO
  html = buffer.getvalue().decode(encoding)
  #decoding the buffer 
  print( buffer )
  print(html)
  linksRegex=re.compile('href=["\']([^"\']*)["\']')

  print( linksRegex.findall(html) )

  m = {}
  m['total-time'] = c.getinfo(pycurl.TOTAL_TIME)
  m['namelookup-time'] = c.getinfo(pycurl.NAMELOOKUP_TIME)
  m['connect-time'] = c.getinfo(pycurl.CONNECT_TIME)
  m['pretransfer-time'] = c.getinfo(pycurl.PRETRANSFER_TIME)
  m['redirect-time'] = c.getinfo(pycurl.REDIRECT_TIME)
  m['starttransfer-time'] = c.getinfo(pycurl.STARTTRANSFER_TIME)

  print('Times:')
  print(m)

  #Ending the session and freeing the resources
  c.close()
  return m

# if __name__ == '__main__':
#   app.run(debug=True)


