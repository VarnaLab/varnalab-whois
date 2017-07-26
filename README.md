
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


# known.json

```json
[]
```

# unknown.json

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


# varnalab.github.io - whois-online.json
# varnalab.slack.com - whois-[active/known/unknown].json
echo $json \
  | $node8 $whois \
    --known $config/known.json \
    --unknown $config/unknown.json \
  | tee \
    >(i=`cut -d$'\n' -f1` && c=`cat $serve/whois-online.json` && if [[ ! -z "${i}" ]]; then echo $i; else echo $c; fi > $serve/whois-online.json) \
    >(i=`cut -d$'\n' -f2` && c=`cat $serve/whois-active.json` && if [[ ! -z "${i}" ]]; then echo $i; else echo $c; fi > $serve/whois-active.json) \
    >(i=`cut -d$'\n' -f3` && c=`cat $serve/whois-known.json` && if [[ ! -z "${i}" ]]; then echo $i; else echo $c; fi > $serve/whois-known.json) \
    >(i=`cut -d$'\n' -f4` && c=`cat $serve/whois-unknown.json` && if [[ ! -z "${i}" ]]; then echo $i; else echo $c; fi > $serve/whois-unknown.json) \
    2>&1 >/dev/null
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
- https://json.varnalab.org/services/whois-known.json
- https://json.varnalab.org/services/whois-unknown.json


[travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-whois-online/master.svg?style=flat-square (Build Status - Travis CI)
[coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-whois-online.svg?style=flat-square (Test Coverage - Coveralls)

[travis]: https://travis-ci.org/VarnaLab/varnalab-whois-online
[coveralls]: https://coveralls.io/github/VarnaLab/varnalab-whois-online
