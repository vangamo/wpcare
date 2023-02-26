# wpcare
Analize, check and verify WP sites

### Development

```bash
cd server_api
source bin/activate
PGSQL_HOST=server_data PGSQL_DB=database PGSQL_USER=user PGSQL_PASSWORD=password bin/flask --app app run --debug
```