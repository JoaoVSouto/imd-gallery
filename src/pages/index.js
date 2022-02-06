import Head from 'next/head';
import { Container } from '@chakra-ui/react';

import dynamic from 'next/dynamic';

const Header = dynamic(
  () => import('../components/Header').then(mod => mod.Header),
  {
    ssr: false,
  }
);
const UploadSection = dynamic(
  () => import('../components/UploadSection').then(mod => mod.UploadSection),
  {
    ssr: false,
  }
);
const Gallery = dynamic(
  () => import('../components/Gallery').then(mod => mod.Gallery),
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
