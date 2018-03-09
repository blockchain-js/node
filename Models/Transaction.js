const EC = require('elliptic').ec
const crypto = require('../utils/crypto')

class Transaction {
  static getCoinbaseTransaction(addr, value, blockIndex) {
    const dateCreated = new Date()
    const transactionHash = crypto.createHash({
      from: '0x00',
      to: addr,
      value,
      fee: 0,
      dateCreated
    })

    return {
      from: '0x00',
      to: addr,
      value,
      fee: 0,
      dateCreated, 
      transactionHash,
      transferSuccessful: true,
      minedInBlockIndex: blockIndex
    }
  }

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
    return crypto.createHash({
      from: this.from,
      to: this.to,
      senderPubKey: this.senderPubKey,
      senderSignature: this.senderSignature,
      value: this.value,
      fee: this.fee,
      dateCreated: this.dateCreated
    })
  }

  isValid(senderSignature) {
    const ec = new EC('secp256k1')

    if (!senderSignature &&
      senderSignature.length !== 2) {
      return false
    }
    var signature = { r: senderSignature[0], s: senderSignature[1] }
    // var key = ec.keyFromPublic(this.senderPubKey, 'hex');

    // return key.verify(msg, signature)
    return true
  }
}

module.exports = Transaction