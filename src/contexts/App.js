import * as React from 'react';
import { useContract } from 'react-ethers';
import Web3 from 'web3';

import Gallery from '../abis/Gallery.json';
import { weiToEther } from '../utils/weiToEther';

const AppContext = React.createContext({});

export function AppProvider({ children }) {
  const contract = useContract(
    Gallery.networks[window.ethereum.networkVersion].address,
    Gallery.abi
  );

  const [web3, setWeb3] = React.useState(null);
  const [rawContract, setRawContract] = React.useState(null);
  const [posts, setPosts] = React.useState([]);

  // TODO: remove this later
  window.contract = contract;
  window.web33 = web3;

  const parsePost = React.useCallback(
    post => ({
      hash: post.hash,
      name: post.name,
      owner: post.owner,
      proposals: post.proposals.map(proposal => ({
        owner: proposal.owner,
        price: weiToEther(
          Number(web3?.utils.hexToNumberString(proposal.price._hex) ?? 0)
        ),
      })),
    }),
    [web3?.utils]
  );

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

  React.useEffect(() => {
    async function retrievePosts() {
      const incomingPosts = await contract.getImages();

      setPosts(incomingPosts.map(parsePost).reverse());
    }

    if (contract) {
      retrievePosts();
    }
  }, [contract, parsePost]);

  React.useEffect(() => {
    function handleImageUploaded(post) {
      setPosts(state => [parsePost(post), ...state]);
    }

    contract?.on('ImageUploaded', handleImageUploaded);

    return () => {
      contract?.removeListener('ImageUploaded', handleImageUploaded);
    };
  }, [contract, parsePost]);

  function handleProposalAccept(hash, proposalOwner) {
    setPosts(state =>
      state.map(post =>
        post.hash === hash
          ? {
              ...post,
              owner: proposalOwner,
              proposals: [],
            }
          : post
      )
    );
  }

  function handleProposalAdd(hash, proposalOwner, proposalValue) {
    setPosts(state =>
      state.map(post =>
        post.hash === hash
          ? {
              ...post,
              proposals: [
                ...post.proposals,
                {
                  owner: proposalOwner,
                  price: weiToEther(Number(proposalValue)),
                },
              ],
            }
          : post
      )
    );
  }

  function handleProposalRemoval(hash, proposalOwner) {
    setPosts(state =>
      state.map(post =>
        post.hash === hash
          ? {
              ...post,
              proposals: post.proposals.filter(
                proposal => proposal.owner !== proposalOwner
              ),
            }
          : post
      )
    );
  }

  return (
    <AppContext.Provider
      value={{
        contract,
        web3,
        rawContract,
        posts,
        handleProposalAccept,
        handleProposalAdd,
        handleProposalRemoval,
      }}
    >
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
