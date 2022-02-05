import { ChakraProvider, extendTheme } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider
      theme={extendTheme({ config: { initialColorMode: 'dark' } })}
    >
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
