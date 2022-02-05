import { Container } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { UploadSection } from '../components/UploadSection';

export default function Home() {
  return (
    <>
      <Header />

      <Container maxW="container.lg">
        <UploadSection />
      </Container>
    </>
  );
}
