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
        this.senderSignature = this.calcSenderSignature() 
    }

    getTransactionHash() {
      return crypto.createHash('sha256').update({
        from: this.from,
        to: this.to,
        senderPubKey: this.senderPubKey,
        senderSignature: this.senderSignature,
        value: this.value,
        fee: this.fee,
        dateCreated: this.dateCreated
      }.toString()).digest('hex')
    }

    calcSenderSignature() {
      // TODO
    }

    isValid(senderSignature) {
      // TODO
      return true
    }
}

module.exports = Transaction