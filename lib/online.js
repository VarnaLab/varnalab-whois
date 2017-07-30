
module.exports = () => {

  var filter = (users, devices, active) => {
    var addresses = devices
      .map((device) => device.mac)

    var known = {}
    var unknown = []

    active.forEach((device) => {
      var index = addresses
        .indexOf(device.mac)
        // better match (if needed)
        // .filter((user) => user.mac.some((mac) =>
        //   mac.replace(/[-:\s]/g, '').toLowerCase() ===
        //   active.mac.replace(/[-:\s]/g, '').toLowerCase()
        // ))

      var user = users
        .find((user) => user.devices.includes(devices[index].id))

      if (user) {
        known[user.id] = user
      }
      else {
        unknown.push(devices[index])
      }
    })

    return {
      known: Object.keys(known).map((key) => known[key]),
      unknown
    }
  }

  return {filter}
}
