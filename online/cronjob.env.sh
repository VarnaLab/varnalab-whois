#!/bin/bash
# this script set specific nvm environment
# use it if you need to run varnalab-cli commands in cron

export NVM_DIR="/path/to/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
which nvm
nvm use VERSION 1> /dev/null
