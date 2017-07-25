#!/bin/bash

# use specific node version
bin=/home/varnalab/.nvm/versions/node/v8.2.1/bin

# @varnalab/cli
json=$($bin/varnalab-whois --config ~/path/to/mikrotik.json --env production --output json)

# varnalab.org
echo $json > ~/path/to/serve/location/active.json

# varnalab.github.io - online.json
# varnalab.slack.com - active/known/unknown.json
echo $json \
  | $bin/node ~/path/to/whois-online.js \
    --known ~/path/to/known.json
    --unknown ~/path/to/unknown.json \
  | tee \
    >(cut -d$'\n' -f2 > ~/path/to/serve/location/whois-online.json) \
    >(cut -d$'\n' -f1 > ~/path/to/serve/location/whois-active.json) \
    >(cut -d$'\n' -f3 > ~/path/to/serve/location/whois-known.json) \
    >(cut -d$'\n' -f4 > ~/path/to/serve/location/whois-unknown.json) \
    2>&1 >/dev/null
