
# varnalab-whois-online

[![travis-ci]][travis] [![coveralls-status]][coveralls]

```bash
git clone git@github.com:VarnaLab/varnalab-whois-online.git
cd varnalab-whois-online
npm i --production
```


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


# known.json

```json
[]
```

# unknown.json

```json
[]
```

# whois-online.sh

Set all `/path/to` locations


# @varnalab/cli

```bash
npm i -g @varnalab/cli
```


# crontab

```bash
# update on every 5 minutes
*/5 * * * *    /path/to/whois-online.sh
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


[travis-ci]: https://img.shields.io/travis/varnalab/varnalab-whois-online/master.svg?style=flat-square (Build Status - Travis CI)
[coveralls-status]: https://img.shields.io/coveralls/varnalab/varnalab-whois-online.svg?style=flat-square (Test Coverage - Coveralls)

[travis]: https://travis-ci.org/varnalab/varnalab-whois-online
[coveralls]: https://coveralls.io/github/varnalab/varnalab-whois-online
