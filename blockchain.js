const CryptoJS = require('crypto-js');
const Block = require('./block');

class Blockchain {
    constructor(difficulty = 4) {
        this.difficulty = difficulty;
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0", this.calculateHash(0, "0", Date.now(), "Genesis Block", 0), 0);
    }

    calculateHash(index, previousHash, timestamp, data, nonce) {
        return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();
    }

    mineBlock(index, previousHash, timestamp, data) {
        let nonce = 0;
        let hash = this.calculateHash(index, previousHash, timestamp, data, nonce);

        const target = Array(this.difficulty + 1).join("0");

        while (!hash.startsWith(target)) {
            nonce++;
            hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
        }

        return {hash, nonce};
    }

    isValidAddress(address) {
        return /^yke[a-fA-F0-9]{47}$/.test(address);
    }

    addBlock(data) {
        const {from, to, value} = data;
        if (!this.isValidAddress(from) || !this.isValidAddress(to)) {
            console.log();
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log("X Endereço inválido. Transação rejeitada. X");
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            return;
        }

        const previousBlock = this.chain[this.chain.length - 1];
        const index = previousBlock.index + 1;
        const timestamp = Date.now();

        const {hash, nonce} = this.mineBlock(index, previousBlock.hash, timestamp, data);

        const newBlock = new Block(index, timestamp, data, previousBlock.hash, hash, nonce);
        this.chain.push(newBlock);
        console.log();
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
        console.log("✓ Bloco adicionado com sucesso! ✓");
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    validateChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.data, currentBlock.nonce)) {
                return false;
            }
        }
        return true;
    }

    getTransactionHistory(address) {
        return this.chain
            .map(block => block.data)
            .filter(data => data.from === address || data.to === address);
    }
}

module.exports = Blockchain;