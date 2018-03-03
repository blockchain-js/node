const block = require('./Block.js')

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        const initialTransaction = {
            "from": 'fromAd',
            "to": 'toAd',
            "value": 500,
            "fee": 50,
            "senderPubKey": 'senderPubKey',
            "senderSignature": 'senderSignature',
            "transactionHash": 'transactionHash',
            "minedInBlockIndex": 'minedBlockInIndex',
            "transferSuccessful": true
        }
        return new block(0, [initialTransaction], 5, '123', 'miner', 'abc1', 'block_data_hash', 'blockhash', 1, 1 / 2 / 2018);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBlockchain() {
        return this.blocks;
    }

    addBlock(blockToAdd) {
        blockToAdd.prevBlockHash = this.getLatestBlock().blockHash;
        blockToAdd.blockHash = blockToAdd.calculateHash();
        this.chain.push(blockToAdd);
    }
}
module.exports = Blockchain