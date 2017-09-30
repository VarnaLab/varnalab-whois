
module.exports = () => {

  // api.varnalab.org
  var api = ({known, unknown}) => ({
    known: known.map((user) => user.id),
    unknown: unknown.map(({id, host, vendor}) => ({id, host, vendor}))
  })

  // varnalab.slack.com
  var slack = ({known, unknown}) =>
    ({
      attachments: !known.length && !unknown.length
      ?
      [
        {
          fallback: 'VarnaLab Whois Command',
          text: '_Няма никой_',
          mrkdwn_in: ['text']
        }
      ]
      :
      [
        {
          fallback: 'VarnaLab Whois Command',
          text: known.reduce((text, user) => text +=
            (
              user.slack
              ? '<https://varnalab.slack.com/team/' +
                user.slack + '|@' + user.slack + '> '
              : ''
            ) +
            '_' + user.name + '_\n'
          , ''),
          mrkdwn_in: ['text']
        },
        {
          fallback: 'VarnaLab Whois Command',
          text: unknown.reduce((text, device) => text +=
            '_' + device.host + '_' +
            (device.vendor ? ' - _' + device.vendor + '_' : '') + '\n'
          , ''),
          mrkdwn_in: ['text']
        }
      ]
    })

  var error = {
    api: {
      error: 'Услугата временно не е налична'
    },
    slack: {
      fallback: 'VarnaLab Whois Command',
      text: '_Услугата временно не е налична_',
      mrkdwn_in: ['text']
    },
  }

  return {api, slack, error}
}
