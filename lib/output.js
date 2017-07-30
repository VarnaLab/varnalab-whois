
module.exports = () => {
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

  var online = (known, unknown) => ({
    known: known.map((user) => user.id),
    unknown: unknown.map((device) => ({
      id: device.id,
      host: device.host,
      vendor: device.vendor
    }))
  })

  var whois = (config, active) => (
    (
      empty =
        active.known.length || active.unknown.length
    ) => ({
      // used in varnalab.github.io
      online: empty
        ? online(active.known, active.unknown)
        : [],
      // used in varnalab.slack.com
      active: empty
        ? slack(active.known, active.unknown)
        : {text: '_Няма никой_', mrkdwn_in: ['text']},
      known: slack(config.known, []),
      unknown: slack([], config.unknown),
    })
  )()

  return {slack, online, whois}
}
