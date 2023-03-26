from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import pycurl
import certifi
from io import BytesIO
import re
from datetime import datetime
import glob
import os
#import src.db.db as db

app = Flask(__name__, static_url_path='', static_folder='static_react')
cors = CORS(app, resources={'/api/*': {'origins': '*'}})
api = Api(app)

@app.route('/')
def get_root():
  return 'Oh oh', 404

@app.route('/pycrawl/')
def get_api_root():
  return 'Site not created', 404

@app.route('/pycrawl-health-check')
def check_flask_health_check():
  try:
    db.get_connection()
  except Exception as ex:
    return 'Error DB: '+str(ex), 503
  else:
    return 'Success', 200

@app.route('/pycrawl/sites/<int:id>/sitemap')
def get_sitemap(id:int=None):
  url = 'https://books.adalab.es/materiales-del-curso-s/s8H2ymn81SElmPsxNXc6/'
  #url = 'https://nucep.com/'
  #url = 'https://abordajemultidisciplinar.net/'
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
  #print(body.decode(encoding))
        
  #retrieve the content BytesIO
  html = buffer.getvalue().decode(encoding)
  
  #decoding the buffer 
  print(html)

  list_of_files = glob.glob('./'+url.replace('https://','').replace('/','-')+'*.html')
  if len(list_of_files) == 0:
    print('No previous files')
  else:
    latest_file = max(list_of_files, key=os.path.getctime)
    print(latest_file)

    with open(latest_file, 'r') as f:
      latest_file_content = f.read()
      print('EQUALS')
      print( latest_file_content == html )

  with open('./'+url.replace('https://','').replace('/','-')+datetime.utcnow().strftime('%Y.%m.%d-%H.%M')+'.html', 'w') as f:
     f.write(html)





  linksRegex=re.compile('href=["\']([^"\']*)["\']')

  print( linksRegex.findall(html) )

  m = {}
  m['url'] = url
  m['total-time'] = c.getinfo(pycurl.TOTAL_TIME)
  m['namelookup-time'] = c.getinfo(pycurl.NAMELOOKUP_TIME)
  m['connect-time'] = c.getinfo(pycurl.CONNECT_TIME)
  m['pretransfer-time'] = c.getinfo(pycurl.PRETRANSFER_TIME)
  m['redirect-time'] = c.getinfo(pycurl.REDIRECT_TIME)
  m['starttransfer-time'] = c.getinfo(pycurl.STARTTRANSFER_TIME)
  m['appconnect-time'] = c.getinfo(pycurl.APPCONNECT_TIME)

  m['http-code'] = c.getinfo(pycurl.HTTP_CODE)
  m['effective-url'] = c.getinfo(pycurl.EFFECTIVE_URL)

  print('Times:')
  print(m)

  #Ending the session and freeing the resources
  c.close()
  return m

# if __name__ == '__main__':
#   app.run(debug=True)


