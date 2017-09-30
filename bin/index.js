#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--users /path/to/users.json')
  console.log('--devices /path/to/devices.json')
  console.log('--output api|slack')
  process.exit()
}

if (!argv.users) {
  console.error('Specify /path/to/users.json')
  process.exit()
}

if (!argv.devices) {
  console.error('Specify /path/to/devices.json')
  process.exit()
}

var fs = require('fs')
var path = require('path')

var fpath = {
  users: path.resolve(process.cwd(), argv.users),
  devices: path.resolve(process.cwd(), argv.devices)
}
var users = require(fpath.users)
var devices = require(fpath.devices)

var online = require('../lib/online')()
var resolve = require('../lib/mac-resolve')()
var device = require('../lib/device')(resolve)
var output = require('../lib/output')(device.sort)


;(() => {
  var data = ''
  process.stdin.on('data', (chunk) => {
    data += chunk
  })
  process.stdin.on('end', (chunk) => {
    try {
      var json = JSON.parse(data)
      run(json)
    }
    catch (err) {
      console.log(JSON.stringify({error: err.message}))
      process.exit()
    }
  })
})()


function run ({active}) {

  device.update(devices, active).then((updated) => {
    fs.writeFileSync(
      fpath.devices, JSON.stringify(updated, null, 2),
      'utf8'
    )

    console.log(JSON.stringify(
      output[argv.output || 'api'](
        online.filter(users, updated, active)
      )
    ))
  })
  .catch((err) => {
    console.log(JSON.stringify({error: err.message}))
    console.error(err)
  })
}
