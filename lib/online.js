
exports.format = ({users, devices, active}) => {

  var macs = devices.map((device) => device.mac)

  var known = {}
  var unknown = {}

  active.forEach((device) => {
    var index = macs.indexOf(device.mac)
    // better match (if needed)
    // .filter((user) => user.mac.some((mac) =>
    //   mac.replace(/[-:\s]/g, '').toLowerCase() ===
    //   active.mac.replace(/[-:\s]/g, '').toLowerCase()
    // ))

    var user = users.find((user) => user.devices.includes(devices[index].id))

    if (user) {
      known[user.id] = user
    }
    else {
      unknown[device.mac] = devices[index]
    }
  })

  return {
    known: Object.keys(known).map((id) => known[id]),
    unknown: Object.keys(unknown).map((mac) => unknown[mac]),
  }
}

exports.blacklist = ({devices, blacklist}) =>
  devices.filter(({id}) => !blacklist.includes(id))

exports.filter = ({known, unknown}) => ({
  known: known.map((user) => user.id),
  unknown: unknown.map(({id, host, vendor}) => ({id, host, vendor}))
})
