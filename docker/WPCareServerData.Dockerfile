ARG PGSQL_WPCARE_DB
ARG PGSQL_WPCARE_USER
ARG PGSQL_WPCARE_PASSWORD

FROM postgres:15.2-alpine

RUN apk add gettext

ARG PGSQL_WPCARE_DB='wpcare'
ARG PGSQL_WPCARE_USER='wpcare'
ARG PGSQL_WPCARE_PASSWORD='wpcare'
ARG TAG

# Download table schema
# tar -czf server_data_v0.1.0.tar.gz init.sql *.sh
ADD https://github.com/vangamo/wpcare/releases/download/v0.1.0/server_data_v0.1.0.tar.gz ./server_data.tar.gz
RUN tar -xzf ./server_data.tar.gz
RUN rm ./server_data.tar.gz
RUN cat ./init.sql | envsubst > /docker-entrypoint-initdb.d/init.sql
RUN cat ./wpcare_schema_$TAG.sh | envsubst > /docker-entrypoint-initdb.d/wpcare_schema_$TAG.sh

EXPOSE 5432