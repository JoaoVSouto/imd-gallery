import Head from 'next/head';
import { Container } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { UploadSection } from '../components/UploadSection';
import { Gallery } from '../components/Gallery';

export default function Home() {
  return (
    <>
      <Head>
        <title>IMD Gallery</title>
      </Head>

      <Header />

      <Container as="main" maxW="container.lg">
        <UploadSection />
        <Gallery />
      </Container>
    </>
  );
}
