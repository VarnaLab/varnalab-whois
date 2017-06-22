
var cpath = process.argv[2]

if (!cpath) {
  console.error('Specify config file')
  process.exit()
}

var fs = require('fs')
var path = require('path')
var dbpath = path.resolve(process.cwd(), cpath)
var config = require(dbpath)


;(() => {
  var data = ''
  process.stdin.on('data', (chunk) => {
    data += chunk
  })
  process.stdin.on('end', (chunk) => {
    try {
      var json = JSON.parse(data)
      job(json)
    }
    catch () {
      process.exit()
    }
  })
})()

function job (json) {
  var active = filter(config, json)

  if (active.unknown.length && addUnknown(config, active.unknown)) {
    fs.writeFileSync(dbpath, JSON.stringify(config, null, 2), 'utf8')
  }

  if (active.known.length || active.unknown.length) {
    console.log(JSON.stringify({
      attachments: attachments(active.known, active.unknown)
    }))
  }
  else {
    console.log(JSON.stringify({
      attachments: [{
        text: '_Няма никой_',
        mrkdwn_in: ['text']
      }]
    }))
  }
  console.log(JSON.stringify({
    attachments: attachments(config.known, [])
  }))
  console.log(JSON.stringify({
    attachments: attachments([], config.unknown)
  }))
}


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
      var id = config.known.indexOf(found[0])
      known[id] = found[0]
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


var attachments = (known, unknown) => [
  {
    text: known
      .reduce((attachment, user) => (
        attachment +=
          '<https://varnalab.slack.com/team/' +
          user.slack + '|@' + user.slack + '>' +
          ' _' + user.name + '_\n',
        attachment
      ), ''),
    mrkdwn_in: ['text']
  },
  {
    text: unknown
      .reduce((attachment, device) => (
        attachment += '_' + device.host + '_\n',
        attachment
      ), ''),
    mrkdwn_in: ['text']
  }
]


var addUnknown = (config, unknown) => {
  var count = config.unknown.length
  unknown.forEach((active) => {
    var found = config.unknown.filter((device) => (device.mac === active.mac))
    if (!found.length) {
      config.unknown.push({mac: active.mac, host: active.host})
    }
  })

  sortUnknown()

  return (config.unknown.length > count)
}

var sortUnknown = () => {
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
