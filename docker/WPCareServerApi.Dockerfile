FROM python:3.9.2-alpine

# Based on <https://github.com/docker/awesome-compose/tree/master/nginx-wsgi-flask>

# Install libpq-dev 
RUN apk add postgresql-dev gcc python3-dev musl-dev

# upgrade pip
RUN pip install --upgrade pip

# permissions and nonroot user for tightened security
RUN adduser -D nonroot
RUN mkdir /home/app/ && chown -R nonroot:nonroot /home/app
RUN mkdir -p /var/log/flask-app && touch /var/log/flask-app/flask-app.err.log && touch /var/log/flask-app/flask-app.out.log
RUN chown -R nonroot:nonroot /var/log/flask-app
WORKDIR /home/app

# Download and deploy server api.
# tar -czf server_api_v0.1.0.tar.gz --exclude='__pycache__' requirements.txt src
ADD https://github.com/vangamo/wpcare/releases/download/v0.1.0/server_api_v0.1.0.tar.gz server_api.tar.gz
RUN tar -xzf server_api.tar.gz
RUN rm server_api.tar.gz
RUN chown nonroot:nonroot requirements.txt && chmod -R 444 requirements.txt && \
    chown -R nonroot:nonroot src && chmod -R 755 src


USER nonroot

# venv
ENV VIRTUAL_ENV=/home/app/venv

# python setup
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN export FLASK_APP=src/app.py
RUN pip install -r requirements.txt

# define the port number the container should expose
EXPOSE 5000

CMD ["python", "src/app.py"]