import psycopg2
import os

print(os.environ)

def get_connection():
  return psycopg2.connect(
    database=os.environ.get('PGSQL_DB','wpcare'),
    user=os.environ.get('PGSQL_USER','wpcare_user'),
    password=os.environ.get('PGSQL_PASSWORD',''),
    host=os.environ.get('PGSQL_HOST','server_data'),
    port=os.environ.get('PGSQL_PORT','5432'),
  )