
module.exports = () => {

  var update = (config, active, resolve, done) => {
    var addresses = config.unknown
      .map((device) => device.mac)

    var missing = []

    active.unknown.forEach((device) => {
      var index = addresses
        .indexOf(device.mac)

      if (index === -1) {
        missing.push({mac: device.mac, host: device.host})
      }
      else {
        config.unknown[index].host = device.host
      }
    })

    if (missing.length) {
      resolve(missing, () => {
        config.unknown = config.unknown.concat(missing)
        sort(config)
        done()
      })
    }
    else {
      process.nextTick(done)
    }
  }

  var active = (config, active) => {
    var addresses = config.unknown
      .map((device) => device.mac)

    active.unknown.forEach((device) => {
      var index = addresses
        .indexOf(device.mac)

      device.vendor = config.unknown[index].vendor
    })
  }

  var sort = (config) => {
    var phones = config.unknown
      .filter((user) => user.host && /android|i?phone/i.test(user.host))
      .sort((a, b) => (
        a.host.toLowerCase() > b.host.toLowerCase() ? 1 :
        a.host.toLowerCase() < b.host.toLowerCase() ? -1 : 0))

    var other = config.unknown
      .filter((user) => user.host && !/android|i?phone/i.test(user.host))
      .sort((a, b) => (
        a.host.toLowerCase() > b.host.toLowerCase() ? 1 :
        a.host.toLowerCase() < b.host.toLowerCase() ? -1 : 0))

    var nohost = config.unknown.filter((user) => !user.host)

    config.unknown = phones.concat(other).concat(nohost)
  }

  return {update, active, sort}
}
