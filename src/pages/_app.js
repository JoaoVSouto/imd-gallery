import dynamic from 'next/dynamic';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../styles/theme';

const Web3ContextProvider = dynamic(
  () => import('react-ethers').then(mod => mod.Web3ContextProvider),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3ContextProvider>
  );
}

export default MyApp;
