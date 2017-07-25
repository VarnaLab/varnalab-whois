
module.exports = () => {

  var filter = (config, json) => {
    var known = {}
    var unknown = []

    json.active.forEach((active) => {
      var found = config.known
        .filter((user) => user.mac.indexOf(active.mac) !== -1)
        // better match (if needed)
        // .filter((user) => user.mac.some((mac) =>
        //   mac.replace(/[-:\s]/g, '').toLowerCase() ===
        //   active.mac.replace(/[-:\s]/g, '').toLowerCase()
        // ))

      if (found.length) {
        var user = found[0]
        known[user.id] = user
      }
      else {
        unknown.push(active)
      }
    })

    return {
      known: Object.keys(known).map((key) => known[key]),
      unknown
    }
  }

  return {filter}
}
