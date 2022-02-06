import * as React from 'react';
import { SimpleGrid, GridItem } from '@chakra-ui/react';

import { useApp } from '../contexts/App';

import { Post } from './Post';

export function Gallery() {
  const { posts, handleProposalAdd, handleProposalRemoval } = useApp();

  return (
    <SimpleGrid
      my={8}
      minChildWidth={['100%', '310px']}
      gap={6}
      justifyItems={{ base: 'center', md: 'start' }}
    >
      {posts.map(post => (
        <GridItem key={post.hash} w={['100%', '310px']}>
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
