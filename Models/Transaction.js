class Transaction {
    constructor(from, to, value, fee, senderPubKey, senderSignature, transactionHash, minedInBlockIndex,
        paid) {
        this.from = from //address
        this.to = to //address
        this.value = value //integer
        this.fee = fee //integer
        this.dateCreated = new Date().getTime() //timestamp
        this.senderPubKey = senderPubKey //hex_number
        this.senderSignature = senderSignature //hex_number[2]
        this.transactionHash = transactionHash //hex_number
        this.minedInBlockIndex = minedInBlockIndex //number / null
        this.transferSuccessful = paid //bool
    }
}










module.exports = Transaction;