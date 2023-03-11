ARG PGSQL_WPCARE_DB
ARG PGSQL_WPCARE_USER
ARG PGSQL_WPCARE_PASSWORD

FROM postgres:15.2-alpine

RUN apk add gettext

ARG PGSQL_WPCARE_DB='wpcare'
ARG PGSQL_WPCARE_USER='wpcare'
ARG PGSQL_WPCARE_PASSWORD='wpcare'

COPY init.sql .
COPY wpcare_*.sh .
RUN cat ./init.sql | envsubst > /docker-entrypoint-initdb.d/init.sql
RUN cat ./wpcare_schema_0.01.sh | envsubst > /docker-entrypoint-initdb.d/wpcare_schema_0.01.sh

EXPOSE 5432