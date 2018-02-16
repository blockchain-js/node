class Node {
    constructor(about, name, peers, blocks, balances, pendingTransactions, difficulty, miningJobs) {
        this.about = about;
        this.name = name;
        this.peers = peers;
        this.blocks = blocks;
        this.balances = balances;
        this.pendingTransactions = pendingTransactions;
        this.difficulty = difficulty;
        this.miningJobs = miningJobs;
    }
}

module.exports = Node;