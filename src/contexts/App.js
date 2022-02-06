import * as React from 'react';
import { useContract } from 'react-ethers';
import Web3 from 'web3';

import Gallery from '../abis/Gallery.json';

const AppContext = React.createContext({});

export function AppProvider({ children }) {
  const contract = useContract(
    Gallery.networks[window.ethereum.networkVersion].address,
    Gallery.abi
  );

  const [web3, setWeb3] = React.useState(null);
  const [rawContract, setRawContract] = React.useState(null);

  // TODO: remove this later
  window.contract = contract;
  window.web33 = web3;

  React.useEffect(() => {
    const newWeb3 = new Web3(window.ethereum);
    setWeb3(newWeb3);
    setRawContract(
      new newWeb3.eth.Contract(
        Gallery.abi,
        Gallery.networks[window.ethereum.networkVersion].address
      )
    );
  }, []);

  return (
    <AppContext.Provider value={{ contract, web3, rawContract }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}
