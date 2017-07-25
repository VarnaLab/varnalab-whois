#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--known /path/to/known.json')
  console.log('--unknown /path/to/unknown.json')
  process.exit()
}

if (!argv.known) {
  console.error('Specify /path/to/known.json')
  process.exit()
}

if (!argv.unknown) {
  console.error('Specify /path/to/unknown.json')
  process.exit()
}

var fs = require('fs')
var path = require('path')

var fpath = {
  known: path.resolve(process.cwd(), argv.known),
  unknown: path.resolve(process.cwd(), argv.unknown)
}
var config = {
  known: require(fpath.known),
  unknown: require(fpath.unknown)
}
var online = require('../lib/online')()
var unknown = require('../lib/unknown')()
var output = require('../lib/output')()
var resolve = require('../lib/mac-resolve')()


;(() => {
  var data = ''
  process.stdin.on('data', (chunk) => {
    data += chunk
  })
  process.stdin.on('end', (chunk) => {
    try {
      var json = JSON.parse(data)
      execute(json)
    }
    catch (err) {
      process.exit()
    }
  })
})()


function execute (json) {

  var active = online.filter(config, json)

  unknown.update(config, active, resolve, () => {

    fs.writeFileSync(
      fpath.unknown, JSON.stringify(config.unknown, null, 2),
      'utf8'
    )

    unknown.active(config, active)
    var whois = output.whois(config, active)

    // used in varnalab.github.io
    console.log(JSON.stringify(whois.online))
    // used in varnalab.slack.com
    console.log(JSON.stringify({attachments: whois.active}))
    console.log(JSON.stringify({attachments: whois.known}))
    console.log(JSON.stringify({attachments: whois.unknown}))
  })
}
