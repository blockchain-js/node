const crypto = require('crypto')
const algorithm = 'aes-256-ctr'

module.exports.createHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}
