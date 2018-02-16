class Transaction {
    constructor(from, to, value, senderPubKey, senderSignature, transactionHash, dateReceived, minedInBlockIndex, paid, fee) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.senderPubKey = senderPubKey;
        this.senderSignature = senderSignature;
        this.transactionHash = transactionHash;
        this.dateReceived = dateReceived;
        this.minedInBlockIndex = minedInBlockIndex;
        this.paid = paid;
        this.fee = fee;
    }
}

module.exports = Transaction;