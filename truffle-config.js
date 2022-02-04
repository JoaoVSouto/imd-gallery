module.exports = {
  networks: {
    development: {
      host: '172.18.48.1',
      port: 7545,
      network_id: '*',
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
