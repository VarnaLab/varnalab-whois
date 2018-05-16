
var uuid = require('uuid')


exports.create = ({devices, active}) => {
  var macs = devices.map((device) => device.mac)
  var missing = {}

  active.forEach((device) => {
    var index = macs.indexOf(device.mac)
    if (index === -1) {
      missing[device.mac] = {id: uuid(), mac: device.mac, host: device.host}
    }
  })

  return Object.keys(missing).map((mac) => missing[mac])
}

exports.update = ({devices, active}) => {
  var macs = devices.map((device) => device.mac)
  var dirty = false

  active.forEach((device) => {
    var index = macs.indexOf(device.mac)
    if (devices[index].host !== device.host) {
      devices[index].host = device.host
      dirty = true
    }
  })

  return dirty
}
