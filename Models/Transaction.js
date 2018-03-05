const crypto = require('crypto')

class Transaction {
    constructor(from, to, value, fee, senderPubKey, date) {
        this.from = from
        this.to = to
        this.value = value
        this.fee = fee
        this.dateCreated = new Date(date).getTime()
        this.senderPubKey = senderPubKey 
        this.transactionHash = this.getTransactionHash()
    }

    getTransactionHash() {
      return crypto.createHash('sha256').update({
        from: this.from,
        to: this.to,
        senderPubKey: this.senderPubKey,
        value: this.value,
        fee: this.fee,
        dateCreated: this.dateCreated
      }.toString()).digest('hex')
    }
}

module.exports = Transaction