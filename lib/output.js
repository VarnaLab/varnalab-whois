
module.exports = (sort) => {

  var online = (known, unknown) => ({
    known: known.map((user) => user.id),
    unknown: unknown.map((device) => ({
      id: device.id,
      host: device.host,
      vendor: device.vendor
    }))
  })

  var slack = (known, unknown) => [
    {
      text: known
        .reduce((attachment, user) => (
          attachment +=
            (
              user.slack
              ? '<https://varnalab.slack.com/team/' +
                user.slack + '|@' + user.slack + '> '
              : ''
            ) +
            '_' + user.name + '_\n',
          attachment
        ), ''),
      mrkdwn_in: ['text']
    },
    {
      text: unknown
        .reduce((attachment, device) => (
          attachment += '_' + device.host + '_' +
          (device.vendor ? ' - _' + device.vendor + '_' : '') + '\n',
          attachment
        ), ''),
      mrkdwn_in: ['text']
    }
  ]

  var whois = (active) => (
    (
      empty =
        active.known.length || active.unknown.length
    ) => ({
      // used in varnalab.github.io
      online: empty
        ? online(active.known, sort(active.unknown))
        : [],
      // used in varnalab.slack.com
      active: empty
        ? slack(active.known, sort(active.unknown))
        : {text: '_Няма никой_', mrkdwn_in: ['text']},
    })
  )()

  return {whois, online, slack}
}
