import * as React from 'react';
import { SimpleGrid, GridItem } from '@chakra-ui/react';

import { useApp } from '../contexts/App';

import { Post } from './Post';

export function Gallery() {
  const { posts, handleProposalAdd, handleProposalRemoval } = useApp();

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
