
module.exports = (sort) => {

  // api.varnalab.org
  var api = ({known, unknown}) => ({
    known: known.map((user) => user.id),
    unknown: unknown.map((device) => ({
      id: device.id,
      host: device.host,
      vendor: device.vendor
    }))
  })

  // varnalab.slack.com
  var slack = ({known, unknown}) =>
    ({
      attachments: !known.length && !unknown.length
      ?
      [
        {
          fallback: 'VarnaLab Command',
          text: '_Няма никой_',
          mrkdwn_in: ['text']
        }
      ]
      :
      [
        {
          fallback: 'VarnaLab Command',
          text: known.reduce((attachment, user) => attachment +=
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
          fallback: 'VarnaLab Command',
          text: unknown.reduce((attachment, device) => attachment +=
            '_' + device.host + '_' +
            (device.vendor ? ' - _' + device.vendor + '_' : '') + '\n'
          , ''),
          mrkdwn_in: ['text']
        }
      ]
    })

  return {api, slack}
}
