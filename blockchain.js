const CryptoJS = require('crypto-js');
const Block = require('./block');

class Blockchain {
    constructor(difficulty = 3) {
        this.difficulty = difficulty;
        this.chain = [this.createGenesisBlock()];
        this.networkNodes = [];
        this.balances = {};
        this.reward = 0;
        this.balances["yke0000000"] = 1000000;
    }

    createGenesisBlock() {
        const genesisData = { from: "system", to: "miner", value: 0 };
        const genesisBlock = new Block(
            0,
            Date.now(),
            genesisData,
            "0",
            this.calculateHash(0, "0", Date.now(), genesisData, 0),
            0
        );
    
        if (!this.balances) this.balances = {};
    
        this.balances["miner"] = this.reward;
        this.balances["yke0000000"] = 1000000;
    
        return genesisBlock;
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

        return { hash, nonce };
    }

    isValidAddress(address) {
        return /^yke[a-fA-F0-9]{7}$/.test(address);
    }

    addBlock(data) {
        const { from, to, value, fee = 0 } = data;

        if (!this.balances) this.balances = {};
        if (!(from in this.balances)) this.balances[from] = 0;
        if (!(to in this.balances)) this.balances[to] = 0;

        if (this.balances[from] < value + fee) {
            console.log();
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log("X Saldo insuficiente. Transação rejeitada. X");
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            return;
        }

        const previousBlock = this.getLatestBlock();
        const index = previousBlock.index + 1;
        const timestamp = Date.now();

        const { hash, nonce } = this.mineBlock(index, previousBlock.hash, timestamp, data);

        const newBlock = new Block(index, timestamp, data, previousBlock.hash, hash, nonce);
        this.chain.push(newBlock);

        this.updateBalances(data);
        console.log();
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
        console.log("✓ Bloco adicionado com sucesso! ✓");
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
    }

    updateBalances(data) {
        //console.log('Estado anterior de balances:', this.balances);

        const { from, to, value, fee = 0 } = data;

        this.balances[from] = this.balances[from] || 0;
        this.balances[to] = this.balances[to] || 0;
        this.balances['miner'] = this.balances['miner'] || 0;

        this.balances[from] -= (value + fee);
        this.balances[to] += value;
        this.balances['miner'] += this.reward + fee;

        //console.log('Estado atual de balances:', this.balances);
    }

    propagateBlock(block) {
        this.networkNodes.forEach((node) => {
            node.receiveBlock(block);
        });
    }

    receiveBlock(block) {
        const latestBlock = this.getLatestBlock();

        if (block.index === latestBlock.index + 1 && block.previousHash === latestBlock.hash) {
            this.chain.push(block);
            console.log(`Bloco recebido e adicionado à cadeia no nó.`);
        } else {
            console.log(`Conflito detectado. Resolvendo cadeia...`);
            this.resolveConflicts();
        }
    }

    resolveConflicts() {
        const chains = this.networkNodes.map((node) => node.chain);
        chains.push(this.chain);

        const longestChain = chains.reduce((longest, current) =>
            current.length > longest.length ? current : longest, this.chain
        );

        if (this.chain !== longestChain) {
            this.chain = longestChain;
            console.log("Conflito resolvido. Cadeia mais longa adotada.");
        } else {
            console.log("Cadeia local já é a mais longa.");
        }
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

    getAddressInfo(address) {
        const balance = this.balances[address] || 0;
        const transactions = this.getTransactionHistory(address);
        return { balance, transactions };
    }
}

module.exports = Blockchain;