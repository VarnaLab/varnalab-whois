#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    --users     /path/to/users.json
    --devices   /path/to/devices.json
    --blacklist /path/to/blacklist.json
    --online    /path/to/online.json
  `)
  process.exit()
}

;['users', 'devices', 'blacklist', 'online'].forEach((file) => {
  if (!argv[file]) {
    console.log(`Specify --${file} /path/to/${file}.json`)
    process.exit()
  }
})


var fs = require('fs')
var path = require('path')

var fpath = {
  users: path.resolve(process.cwd(), argv.users),
  devices: path.resolve(process.cwd(), argv.devices),
  blacklist: path.resolve(process.cwd(), argv.blacklist),
  online: path.resolve(process.cwd(), argv.online),
}
var users = require(fpath.users)
var devices = require(fpath.devices)
var blacklist = require(fpath.blacklist)

var device = require('../lib/device')
var resolve = require('../lib/resolve')
var online = require('../lib/online')


;(() => {
  var data = ''
  process.stdin.on('data', (chunk) => {
    data += chunk
  })
  process.stdin.on('end', (chunk) => {
    try {
      var json = JSON.parse(data)
      run({devices, users, active: json.active})
    }
    catch (err) {
      console.log(JSON.stringify({error: 'Услугата временно не е налична'}))
      process.exit()
    }
  })
})()


async function run ({devices, users, active}) {

  var created = device.create({devices, active})
  if (created.length) {
    var resolved = await resolve({devices: created})
    devices = devices.concat(resolved)
  }

  var dirty = device.update({devices, active})
  if (dirty || created.length) {
    fs.writeFileSync(fpath.devices, JSON.stringify(devices, null, 2), 'utf8')
  }

  var active = online.format({users, devices, active})
  active.unknown = online.blacklist({devices: active.unknown, blacklist})
  fs.writeFileSync(fpath.online, JSON.stringify(online.filter(active)), 'utf8')

}
