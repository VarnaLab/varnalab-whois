
var request = require('request-compose').client
var https = require('https')


var timeout = () => new Promise((resolve) => setTimeout(resolve, 1250))

var resolve = async ({mac, options}) => {
  await timeout()

  try {
    var {body:vendor} = await request(Object.assign({}, options, {
      url: `${options.url}/${mac}`,
    }))
  }
  catch ({res}) {
    vendor = res && res.statusCode === 404 ? false : null
  }

  return vendor
}

module.exports = async ({devices, options}) => {
  options = options || {
    url: 'https://api.macvendors.com',
    agent: new https.Agent({keepAlive: true, maxSockets: 1}),
  }

  var result = []

  for (var {id, mac, host, vendor} of devices) {
    result.push({
      id, mac, host, vendor: vendor || vendor === false ? vendor :
        await resolve({mac: mac.slice(0, 8), options})
    })
  }

  return result
}
