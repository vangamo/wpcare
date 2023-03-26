# wpcare
Analize, check and verify WP sites

### Development

Setup

```bash
# to install pycurl
apk add curl curl-dev libressl-dev
# or
apt install build-essential python3-dev libcurl4-openssl-dev libssl-dev

pip install Flask Flask-Cors Flask-RESTful
# pip install gunicorn # Only for Docker.
psycopg2-binary
pip install pycurl

pip freeze > requirements.txt
```

```bash
cd server_api
source bin/activate
PGSQL_WPCARE_HOST=server_data PGSQL_WPCARE_DB=database PGSQL_WPCARE_USER=user PGSQL_WPCARE_PASSWORD=password bin/flask --app app run --debug
```