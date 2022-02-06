require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = process.env.ROPSTEN_MNEMONIC;
const rpc_url = `https://ropsten.infura.io/v3/${process.env.ROPSTEN_INFURA_API_KEY}`;

module.exports = {
  networks: {
    development: {
      host: '172.18.48.1',
      port: 7545,
      network_id: '*',
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(mnemonic, rpc_url);
      },
      network_id: '3',
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '^0.8.11',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
