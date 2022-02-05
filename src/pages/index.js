import Head from 'next/head';
import { Container } from '@chakra-ui/react';

import { UploadSection } from '../components/UploadSection';
import { Gallery } from '../components/Gallery';
import dynamic from 'next/dynamic';

const Header = dynamic(
  () => import('../components/Header').then(mod => mod.Header),
  {
    ssr: false,
  }
);

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
