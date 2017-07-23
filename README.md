
# varnalab-whois / online


# mikrotik.json

```json
{
  "development": {
    "host": "",
    "user": "",
    "pass": "",
    "port": 0
  },
  "production": {
    "host": "",
    "user": "",
    "pass": "",
    "port": 0
  }
}
```


# macdb.json

```json
{
  "known": [],
  "unknown": []
}
```


# cronjob.env.sh

Set NodeJS `VERSION` and `/path/to`


# whois-online.sh

Set all `/path/to` locations


# @varnalab/cli

```bash
npm install -g @varnalab/cli
```


# crontab

```bash
# periodic update curl -k https://json.varnalab.org/services/whois-active.json on every 5 minutes
*/5 * * * *    (. /path/to/cronjob.env.sh; /path/to/whois-online.sh; )
```


# Nginx

```nginx
server {
  listen *:80;
  listen *:443 ssl;

  server_name json.varnalab.org ;
  root   /serve/location/;

  # ... set up SSL locations

  # convert POST to GET
  error_page 405 =200 @405;
  location @405 {
    root   /serve/location/;
    proxy_method GET;
    proxy_pass http://static_backend;
  }
}

# POST STATIC CONTENT
server {
  listen 127.0.0.1:89;
  server_name _;
  root   /serve/location/;
}
```


# URLs

- https://json.varnalab.org/services/active.json
- https://json.varnalab.org/services/whois-active.json
- https://json.varnalab.org/services/whois-known.json
- https://json.varnalab.org/services/whois-unknown.json
- https://json.varnalab.org/services/whois-online.json
