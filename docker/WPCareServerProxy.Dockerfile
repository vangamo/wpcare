FROM nginx:1.19.7-alpine

# Add bash for boot cmd
RUN apk add bash

# Add nginx.conf to container
ADD https://raw.githubusercontent.com/vangamo/wpcare/dev/server_proxy/default.conf /tmp/default.conf
ADD https://raw.githubusercontent.com/vangamo/wpcare/dev/server_proxy/nginx.conf /etc/nginx/nginx.conf
ADD https://raw.githubusercontent.com/vangamo/wpcare/dev/server_proxy/start.sh /app/start.sh
RUN chown nginx:nginx /tmp/default.conf
RUN chown nginx:nginx /etc/nginx/nginx.conf
RUN chown nginx:nginx /app/start.sh

# Download and deploy frontend for admin backend.
# tar -czvf v0.1.2.tar.gz -C dist .
ARG TAG
ADD https://github.com/vangamo/wpcare/releases/download/v${TAG}/frontend_admin_v${TAG}.tar.gz /app/static/frontend.tar.gz
RUN tar -xzf /app/static/frontend.tar.gz -C /app/static
RUN rm /app/static/frontend.tar.gz

# Set workdir
WORKDIR /app

# Permissions and nginx user for tightened security
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chmod -R 755 /var/log/nginx; \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid

# Comment for logging to stdout and stderr - Leave uncommented to keep the nginx logs inside the container
RUN mkdir -p /var/log/nginx
RUN unlink /var/log/nginx/access.log \
    && unlink /var/log/nginx/error.log \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown nginx /var/log/nginx/*log \
    && chmod 644 /var/log/nginx/*log

USER nginx

RUN ls -lh /tmp

CMD ["nginx", "-g", "'daemon off;'"]