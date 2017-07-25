#!/bin/bash
# this script set specific nvm environment
# use it if you need to run varnalab-cli commands in cron

export NVM_DIR="/home/varnalab/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
which nvm
nvm use v4.6.1 1> /dev/null
