#!/bin/bash

# @varnalab/cli
json=$(varnalab-whois --config ~/path/to/mikrotik.json --env production --output json)

# varnalab.org
echo $json > ~/path/to/serve/location/active.json

# slack
echo $json \
  | node ~/path/to/whois-online.js ~/path/to/known.json  ~/path/to/unknown.json \
  | tee \
    >(cut -d$'\n' -f1 > ~/path/to/serve/location/whois-active.json) \
    >(cut -d$'\n' -f2 > ~/path/to/serve/location/whois-online.json) \
    >(cut -d$'\n' -f3 > ~/path/to/serve/location/whois-known.json) \
    >(cut -d$'\n' -f4 > ~/path/to/serve/location/whois-unknown.json) \
    2>&1 >/dev/null
