import Head from 'next/head';
import { Container } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { UploadSection } from '../components/UploadSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>IMD Gallery</title>
      </Head>

      <Header />

      <Container as="main" maxW="container.lg">
        <UploadSection />
      </Container>
    </>
  );
}
