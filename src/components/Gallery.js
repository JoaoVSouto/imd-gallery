import * as React from 'react';
import { SimpleGrid, GridItem } from '@chakra-ui/react';

import { useApp } from '../contexts/App';
import { weiToEther } from '../utils/weiToEther';

import { Post } from './Post';

export function Gallery() {
  const { contract, web3 } = useApp();

  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    async function retrievePosts() {
      const incomingPosts = await contract.getImages();

      setPosts(
        incomingPosts
          .map(post => ({
            hash: post.hash,
            name: post.name,
            owner: post.owner,
            proposals: post.proposals.map(proposal => ({
              owner: proposal.owner,
              price: weiToEther(
                Number(web3.utils.hexToNumberString(proposal.price._hex))
              ),
            })),
          }))
          .reverse()
      );
    }

    retrievePosts();
  }, [contract, web3.utils]);

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
    <SimpleGrid my={8} minChildWidth={['240px', '310px']} gap={6}>
      {posts.map(post => (
        <GridItem key={post.hash} w={['240px', '310px']}>
          <Post
            {...post}
            onAddProposal={handleProposalAdd}
            onProposeRemoval={handleProposalRemoval}
          />
        </GridItem>
      ))}
    </SimpleGrid>
  );
}
