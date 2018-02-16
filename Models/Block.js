class Block {
    constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, blockHash, nonce, dateCreated) {
        this.index = index; // set index
        this.transactions = transactions; // []
        this.difficulty = difficulty; // mining difficulty
        this.prevBlockHash = prevBlockHash;
        this.minedBy = minedBy; // address of miner
        this.blockDataHash = blockDataHash;

        this.nonce = nonce; // lucky number
        this.dateCreated = dateCreated; //date
        this.blockHash = blockHash;
    }
}

module.exports = Block;