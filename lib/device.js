
var uuid = require('uuid')


module.exports = (resolve) => {

  var update = (devices, active, done) => {
    var addresses = devices
      .map((device) => device.mac)

    var missing = {}

    active.forEach((device) => {
      var index = addresses
        .indexOf(device.mac)
        // better match (if needed)
        // .filter((user) => user.mac.some((mac) =>
        //   mac.replace(/[-:\s]/g, '').toLowerCase() ===
        //   active.mac.replace(/[-:\s]/g, '').toLowerCase()
        // ))

      if (index === -1) {
        missing[device.mac] = {id: uuid(), mac: device.mac, host: device.host}
      }
      else {
        devices[index].host = device.host
      }
    })

    missing = Object.keys(missing)
      .map((mac) => missing[mac])

    if (missing.length) {
      resolve(missing, () => {
        done(devices.concat(missing))
      })
    }
    else {
      process.nextTick(() => done(devices))
    }
  }

  var sort = (devices) => {
    var phones = devices
      .filter((device) => device.host && /android|i?phone/i.test(device.host))
      .sort((a, b) => (
        a.host.toLowerCase() > b.host.toLowerCase() ? 1 :
        a.host.toLowerCase() < b.host.toLowerCase() ? -1 : 0))

    var other = devices
      .filter((device) => device.host && !/android|i?phone/i.test(device.host))
      .sort((a, b) => (
        a.host.toLowerCase() > b.host.toLowerCase() ? 1 :
        a.host.toLowerCase() < b.host.toLowerCase() ? -1 : 0))

    var nohost = devices.filter((device) => !device.host)

    return phones.concat(other).concat(nohost)
  }

  return {update, sort}
}
