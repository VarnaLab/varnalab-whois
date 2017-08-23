
# varnalab-whois

[![travis-ci]][travis] [![coveralls-status]][coveralls]


# nvm

```bash
nvm install node 4
nvm install node 8
```


# varnalab-whois

```bash
git clone git@github.com:VarnaLab/varnalab-whois.git
cd varnalab-whois
npm i --production
```


# varnalab-cli

```bash
git clone git@github.com:VarnaLab/varnalab-cli.git
cd varnalab-cli
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


# users.json

```json
[]
```

# devices.json

```json
[]
```

# whois-online.sh

```bash
#!/bin/bash

# globals
user=varnalab
nodev4=v4.6.1
nodev8=v8.2.1

# node
node4=/home/$user/.nvm/versions/node/$nodev4/bin/node
node8=/home/$user/.nvm/versions/node/$nodev8/bin/node

# locations
config=/home/$user/simo/config/varnalab-whois
projects=/home/$user/simo/projects
serve=/home/$user/services/public

# projects
cli=$projects/varnalab-cli/bin/whois.js
whois=$projects/varnalab-whois/bin/


#########################################################


# @varnalab/cli
json=$($node4 $cli --config $config/mikrotik.json --env production --output json)

# varnalab.org - active.json
echo $json > $serve/active.json


# --output api   - api.varnalab.org
# --output slack - varnalab.slack.com
echo $online |
  $node8 $whois \
    --users $config/users.json \
    --devices $config/devices.json \
    --output slack \
    > $serve/online.json
```


# crontab

```bash
# update on every 5 minutes
*/5 * * * *    /home/varnalab/simo/config/varnalab-whois/whois-online.sh
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

- used in *varnalab.org*
- https://json.varnalab.org/services/active.json
- used in *varnalab.github.io*
- https://json.varnalab.org/services/whois-online.json
- used in *varnalab.slack.com*
- https://json.varnalab.org/services/whois-active.json


[travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-whois/master.svg?style=flat-square (Build Status - Travis CI)
[coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-whois.svg?style=flat-square (Test Coverage - Coveralls)

[travis]: https://travis-ci.org/VarnaLab/varnalab-whois
[coveralls]: https://coveralls.io/github/VarnaLab/varnalab-whois
