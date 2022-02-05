import {
  Flex,
  Text,
  Image,
  Container,
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { BellIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Identicon from 'identicon.js';
import { useWeb3 } from 'react-ethers';

import { formatAddress } from '../utils/formatAddress';

export function Header() {
  const { state, connectToMetamask } = useWeb3();

  const proposals = [1];

  return (
    <Box
      as="header"
      p="4"
      borderBottom="1px solid"
      borderBottomColor="gray.600"
      pos="sticky"
      top={0}
      zIndex="sticky"
      bgColor="gray.800"
    >
      <Container
        as={Flex}
        maxW="container.lg"
        alignItems="center"
        justifyContent={['flex-end', 'space-between']}
      >
        <Text fontWeight="bold" fontSize="2xl" display={['none', 'block']}>
          <Text as="span" color="blue.400">
            imd
          </Text>
          .gallery
        </Text>

        {state.isLogged ? (
          <Flex gap="3" align="center">
            <Popover>
              <PopoverTrigger>
                <Button variant="unstyled" colorScheme="blue" pos="relative">
                  <BellIcon fontSize="xl" />
                  <Text
                    as="small"
                    pos="absolute"
                    top="6px"
                    right="3px"
                    bg="red.600"
                    w={4}
                    h={4}
                    d="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="full"
                  >
                    1
                  </Text>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Proposals</PopoverHeader>
                <PopoverBody>
                  {proposals.length === 0 ? (
                    "You don't have any proposals yet!"
                  ) : (
                    <Flex direction="column" gap={3}>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap="2">
                          <Image
                            src="https://www.arweave.net/gySlSWWvotlwL1lWwtSE_HpROBjfnSVbzP0UX44Kdws?ext=png"
                            alt="NoiaDuck 331"
                            borderRadius="full"
                            boxSize="32px"
                            objectFit="cover"
                          />
                          <Text>NoiaDuck #331</Text>
                          <Text fontWeight="bold">3 Ξ</Text>
                        </Flex>

                        <Flex gap="2">
                          <Button size="xs" colorScheme="green" variant="ghost">
                            <CheckIcon />
                          </Button>
                          <Button size="xs" colorScheme="red" variant="ghost">
                            <CloseIcon fontSize="x-small" />
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Text>{formatAddress(state.account)}</Text>
            <Image
              borderRadius="full"
              boxSize="30px"
              src={`data:image/png;base64,${new Identicon(
                state.account,
                30
              ).toString()}`}
              alt="user profile"
            />
          </Flex>
        ) : (
          <Button colorScheme="orange" onClick={connectToMetamask}>
            Connect to Metamask
          </Button>
        )}
      </Container>
    </Box>
  );
}
