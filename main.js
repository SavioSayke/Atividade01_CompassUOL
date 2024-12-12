const Blockchain = require('./blockchain');
const readline = require('readline');
const { format } = require('date-fns');

const transaction = new Blockchain(4);

function showBlockchain(blockchain) {
    blockchain.chain.forEach(block => {
        const boxWidth = 85;

        const line = '*'.repeat(boxWidth);

        function formatLine(text) {
            const availableSpace = boxWidth - 4;
            const leftSpace = ' '.repeat(Math.max(availableSpace - text.length, 0));
            return `* ${text}${leftSpace} *`;
        }

        console.log(line);
        console.log(formatLine(`Bloco #${block.index}`));
        console.log(formatLine(`Timestamp: ${format(new Date(block.timestamp), 'yyyy-MM-dd HH:mm:ss')}`));
        console.log(formatLine(`Dados: `));
        console.log(formatLine(`    From:  ${block.data.from}`));
        console.log(formatLine(`    To:    ${block.data.to}`));
        console.log(formatLine(`    Value: ${block.data.value}`));
        console.log(formatLine(`Hash Anterior: ${block.previousHash}`));
        console.log(formatLine(`Hash: ${block.hash}`));
        console.log(formatLine(`Nonce: ${block.nonce}`));
        console.log(line);
        console.log();
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    console.log();
    console.log("Menu - Yke's Blockchain");
    console.log();
    console.log("1 - Exibir blockchain");
    console.log("2 - Adicionar novo bloco");
    console.log("3 - Exibir histórico de transações por endereço");
    console.log("4 - Sair");
    console.log();

    rl.question("Informe a opção que deseja navegar: ", (option) => {
        console.log();
        switch (option) {
            case '1':
                showBlockchain(transaction);
                menu();
                break;

            case '2':
                rl.question("Digite o endereço de origem (from): ", (from) => {
                    rl.question("Digite o endereço de destino (to): ", (to) => {
                        rl.question("Digite o valor da transação: ", (value) => {
                            console.log();
                            console.log('Minerando...');
                            transaction.addBlock({from, to, value: parseFloat(value)});
                            menu();
                        });
                    });
                });
                break;

            case '3':
                rl.question("Digite o endereço para verificar o histórico de transações: ", (address) => {
                    if (!transaction.isValidAddress(address)) {
                        console.log();
                        console.log('<><><><><><><><><><><>');
                        console.log("< Endereço inválido. >");
                        console.log('<><><><><><><><><><><>');
                    } else {
                        const history = transaction.getTransactionHistory(address);
                        if (history.length === 0) {
                            console.log();
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log("X Nenhuma transação encontrada para este endereço. X");
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        } else {
                            console.log();
                            console.log("Histórico de transações:");
                            console.log('---------------------------------------------------------');
                            history.forEach((data, index) => {
                                console.log();
                                console.log(`#${index + 1}`);
                                console.log(`From:  ${data.from}`);
                                console.log(`To:    ${data.to}`);
                                console.log(`Value: ${data.value}`, 'YkeCoin');
                                console.log();
                                console.log('---------------------------------------------------------');
                            });
                        }
                    }
                    menu();
                });
                break;

            case '4':
                console.log("♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡");
                console.log("♡ Obrigado por utilizar. ♡");
                console.log("♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡");
                rl.close();
                break;

            default:
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                console.log("x Opção inválida. Por favor, escolha uma opção válida! x");
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                menu();
                break;
        }
    });
}

menu();