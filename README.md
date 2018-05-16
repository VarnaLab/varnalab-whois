
# varnalab-whois

[![travis-ci]][travis] [![coveralls-status]][coveralls]

```bash
varnalab-whois \
  --users /path/to/users.json \
  --devices /path/to/devices.json \
  --blacklist /path/to/blacklist.json \
  --online /path/to/online.json
```

## [@varnalab/cli][varnalab-cli] + varnalab-whois

```bash
#!/bin/bash

# node
if [ $(hostname) = "nuc" ]; then
  node4=/home/s/.nvm/versions/node/v4.8.7/bin/node
  node=node
elif [ $(hostname) = "box" ]; then
  node4=/home/s/.nvm/versions/node/v4.8.6/bin/node
  node=/home/s/.nvm/versions/node/v8.9.1/bin/node
fi

# @varnalab/cli
online=$($node4 \
  ~/projects/varnalab-cli/bin/whois.js \
  --config ~/config/varnalab-whois/mikrotik.json \
  --env production \
  --output json\
)

# varnalab-whois
echo $online | $node \
  ~/projects/varnalab-whois/bin/cli.js \
  --users ~/config/varnalab-api/users.json \
  --devices ~/config/varnalab-api/devices.json \
  --blacklist ~/config/varnalab-api/blacklist.json \
  --online ~/config/varnalab-api/online.json
```


  [travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-whois/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-whois.svg?style=flat-square (Test Coverage - Coveralls)

  [travis]: https://travis-ci.org/VarnaLab/varnalab-whois
  [coveralls]: https://coveralls.io/github/VarnaLab/varnalab-whois

  [varnalab-cli]: https://github.com/VarnaLab/varnalab-cli
