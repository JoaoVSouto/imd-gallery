import { SimpleGrid, GridItem } from '@chakra-ui/react';

import { Post } from './Post';

export function Gallery() {
  return (
    <SimpleGrid my={8} minChildWidth={['240px', '310px']} gap={6}>
      <GridItem w={['240px', '310px']}>
        <Post />
      </GridItem>
      <GridItem w={['240px', '310px']}>
        <Post />
      </GridItem>
      <GridItem w={['240px', '310px']}>
        <Post />
      </GridItem>
      <GridItem w={['240px', '310px']}>
        <Post />
      </GridItem>
      <GridItem w={['240px', '310px']}>
        <Post />
      </GridItem>
    </SimpleGrid>
  );
}
