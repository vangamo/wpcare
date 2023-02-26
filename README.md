# wpcare
Analize, check and verify WP sites

### Development

```bash
cd server_api
source bin/activate
PGSQL_WPCARE_HOST=server_data PGSQL_WPCARE_DB=database PGSQL_WPCARE_USER=user PGSQL_WPCARE_PASSWORD=password bin/flask --app app run --debug
```