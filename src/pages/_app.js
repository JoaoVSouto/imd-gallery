import dynamic from 'next/dynamic';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../styles/theme';

const Web3ContextProvider = dynamic(
  () => import('react-ethers').then(mod => mod.Web3ContextProvider),
  {
    ssr: false,
  }
);
const AppProvider = dynamic(
  () => import('../contexts/App').then(mod => mod.AppProvider),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <ChakraProvider theme={theme}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </ChakraProvider>
    </Web3ContextProvider>
  );
}

export default MyApp;
