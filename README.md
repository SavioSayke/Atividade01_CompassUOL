# Atividade Individual - Blockchain

Continuação do projeto da Blockchain com novas funções.

Foi implementado em Javascript uma blockchain básica. Ela cria uma cadeia simples de blocos, onde cada bloco contém dados de transações. A blockchain garante a integridade dos dados por meio da função hash e fornece funcionalidades para adicionar blocos e validar toda a cadeia.

---

## Novidades

* **Menu Interativo**: Um menu foi adicionado para permitir que o usuário navegue facilmente pelas funcionalidades da blockchain.
* **Mineração**: Implementação do "Proof of Work", que exige que o hash do bloco comece com uma certa quantidade de zeros, definida pela dificuldade configurável.
* **Validação de Endereços**: Os endereços de origem e destino em transações agora seguem o padrão "yke" seguido por 7 caracteres hexadecimais.
* **Histórico de Transações**: Consultar o histórico completo de transações associadas a um endereço específico.
* **Informações do Endereço**: É possível visualizar o saldo e as transações associadas a qualquer endereço.
* **Rastreamento de Saldos**: Cada endereço possui um saldo rastreável, que é atualizado automaticamente sempre que novos blocos são minerados ou transações são realizadas.
* **Comunicação entre Nós**: A blockchain permite simular a comunicação entre múltiplos nós na rede, com propagação de blocos.
* **Resolução de Conflitos (Forks)**: Em caso de cadeias divergentes, a blockchain resolve conflitos adotando a cadeia mais longa.
* **Bloco Gênesis Personalizado**: Agora o primeiro bloco (gênesis) inclui transações iniciais que atribuem saldo a um endereço especial chamado `yke0000000` com 1.000.000 de YkeCoin para que sejam feitas transações para outros endereços.

---

## Como utilizar/rodar o projeto

Para utilizar este projeto:

1. É preciso ter o [Node.js](https://nodejs.org/pt/download/package-manager) instalado.

2. Clone esse repositório.
```bash
git clone https://github.com/SavioSayke/Atividade01_CompassUOL.git
```

3. Após clonar o repositório, navegue até o diretório dos arquivos pelo seu terminal. Abra seu terminal dentro do diretório do projeto:
    * Para abrir o terminal, navegue até o diretório onde o projeto foi salvo, agora: **segure Shift + botão direito do mouse**. Selecione "Abrir o terminal" ou abra o terminal de sua preferência.

4. Acesse a branch **blockchainFinal**:
```bash
git checkout blockchainFinal
```

5. Instale as dependências necessárias:
```bash
npm install crypto-js
```
```bash
npm install date-fns
```

6. Execute o script utilizando:
```bash
node main.js
```

---

## Funcionalidades

- **Criação do Bloco Gênesis**: O primeiro bloco da blockchain é criado automaticamente com dados predefinidos, incluindo a inicialização de saldos.
- **Adição de Blocos**: Permite adicionar novos blocos com dados de transações válidas.
- **Cálculo de Hash**: Utiliza hashing SHA-256 para garantir a integridade de cada bloco.
- **Validação da Cadeia**: Verifica a validade da blockchain para identificar possíveis adulterações.
- **Rastreamento de Saldos**: Todos os endereços têm seus saldos rastreados e atualizados automaticamente após transações ou mineração.
- **Consulta de Histórico**: Permite visualizar as transações associadas a qualquer endereço.
- **Informações do Endereço**: Exibe o saldo e as transações relacionadas a um endereço específico.
- **Simulação de Rede**: Propagação de blocos entre nós simulados e resolução de conflitos em caso de forks.
- **Registro de Data e Hora**: Registra o momento em que cada bloco é criado.

---

## Tecnologias Utilizadas

- **JavaScript**: A linguagem de programação principal utilizada para construir a blockchain.
- **CryptoJS**: Uma biblioteca usada para funções criptográficas, especificamente para hashing.
- **date-fns**: Uma biblioteca para formatação de datas.

---

## Informações sobre o Código

### class Block

A classe `Block` representa cada bloco na blockchain e inclui propriedades como:

- `index`: A posição do bloco na cadeia.
- `timestamp`: O momento em que o bloco foi criado.
- `data`: Os dados da transação armazenados no bloco.
- `previousHash`: O hash do bloco anterior na cadeia.
- `hash`: O hash do bloco atual.
- `nonce`: Número arbitrário utilizado na mineração do bloco.

### class Blockchain

A classe `Blockchain` gerencia toda a cadeia de blocos. Métodos principais incluem:

- **createGenesisBlock()**: Cria o primeiro bloco com valores predefinidos.
- **calculateHash()**: Gera um hash para os dados de um bloco dado.
- **addBlock()**: Adiciona um novo bloco com os dados da transação fornecidos.
- **getLatestBlock()**: Recupera o bloco mais recente na cadeia.
- **validateChain()**: Valida a integridade da blockchain.
- **getTransactionHistory()**: Recupera todas as transações associadas a um endereço.
- **getAddressInfo()**: Retorna o saldo e o histórico de transações de um endereço.
- **propagateBlock()**: Propaga blocos para outros nós na rede.
- **resolveConflicts()**: Resolve conflitos de fork, adotando a cadeia mais longa.

### Exemplos de Transações

- Transferir 100 moedas:
```javascript
blockchain.addBlock({ from: "yke0000000", to: "yke0000001", value: 100, fee: 2 });
```

### Exibindo a Blockchain

A função `showBlockchain` formata e exibe os detalhes de cada bloco no console, incluindo:

- Número do bloco
- Timestamp
- Dados da transação
  - From    (Remetente da transação)
  - To      (Destinatário da transação)
  - Value   (Valor da transação)
  - Fee     (Taxa da transação)
- Hash anterior
- Hash atual
- Nonce

---