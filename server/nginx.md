# Nginx Configurations

The following is my webserver configurations. Configurations are adapted from [Raspberry IoT Dashboard](https://github.com/lauslim12/raspberry-iot-dashboard) and [Secure Nginx Configurations](https://gist.github.com/plentz/6737338).

## `nginx.conf`

```bash
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
  worker_connections 768;
  multi_accept on; # accept multi_accept to accept all new connections at a time
}

http {
  ##
  # Basic Settings
  ##
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;
  server_tokens off; # remove nginx version number

  # server_names_hash_bucket_size 64;
  # server_name_in_redirect off;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  ##
  # SSL Settings
  ##
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
  ssl_prefer_server_ciphers on;

  ##
  # Logging Settings
  ##
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  ##
  # Gzip Settings
  ##
  gzip on;
  gzip_vary on; # cache both the gzipped and regular version of a resource
  gzip_proxied any; # ensures all proxied request responses are gzipped
  gzip_comp_level 5; # compress up to level 5 for performance

  # gzip_buffers 16 8k;

  gzip_http_version 1.1; # enable compression for both HTTP 1.0/1.1
  gzip_min_length 256; # files smaller than 256 bytes would not be gzipped to prevent overhead
  gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/rss+xml
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/svg+xml
    image/x-icon
    text/css
    text/plain
    text/x-component
    text/javascript
    text/xml;

  ##
  # Virtual Host Configs
  ##
  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}

# mail {
#       # See sample authentication script at:
#       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript

#       # auth_http localhost/auth.php;
#       # pop3_capabilities "TOP" "USER";
#       # imap_capabilities "IMAP4rev1" "UIDPLUS";

#       server {
#               listen     localhost:110;
#               protocol   pop3;
#               proxy      on;
#       }

#       server {
#               listen     localhost:143;
#               protocol   imap;
#               proxy      on;
#       }
# }
```

## `sites-available/server.dev`

It is actually not `server.dev`, it's an arbitrary name that you should change according to your domain name / your own tastes. You may even replace `default` in `/etc/nginx/sites-available/default` by this one.

```bash
upstream attendance-web {
  server localhost:3000;
}

upstream attendance-api {
  server localhost:8080;
}

server {
  # Server metadata. Comment if not using 'default_server' (you have other servers behind this proxy).
  listen 80 default_server;
  listen [::]:80 default_server;

  # Uncomment if using a domain name.
  # listen 80
  # listen [::]:80
  # server_name my-domain.com www.my-domain.com -- keep this commented if not using domains

  # Main entrypoint.
  location / {
    # Include proxy parameters and passes.
    include proxy_params;
    proxy_pass http://attendance-web;
  }

  # API entrypoint.
  location /api {
    # Include proxy parameters and passes.
    include proxy_params;
    proxy_pass http://attendance-api;

    # Set max headers size.
    proxy_headers_hash_max_size 512;
    proxy_headers_hash_bucket_size 128;

    # Turn off proxy buffering for performance.
    proxy_redirect off;
    proxy_buffering off;

    # Do not change these.
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
