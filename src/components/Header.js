import * as React from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { BellIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import Identicon from 'identicon.js';
import { useWeb3 } from 'react-ethers';

import { useApp } from '../contexts/App';
import { formatAddress } from '../utils/formatAddress';
import { weiToEther } from '../utils/weiToEther';

export function Header() {
  const { state, connectToMetamask } = useWeb3();
  const { rawContract, web3, handleProposalAccept, handleProposalRemoval } =
    useApp();
  const toast = useToast();

  const [proposals, setProposals] = React.useState([]);
  const [acceptingProposal, setAcceptingProposal] = React.useState(null);
  const [refusingProposal, setRefusingProposal] = React.useState(null);

  React.useEffect(() => {
    async function getProposals() {
      const incomingProposals = await rawContract.methods
        .getProposalsByOwner()
        .call({ from: state.account });

      setProposals(
        incomingProposals
          .map(proposal => ({
            owner: proposal.owner,
            price: weiToEther(Number(proposal.price)),
            imageHash: proposal.hash,
            imageName: proposal.name,
          }))
          .reverse()
      );
    }

    getProposals();
  }, [rawContract.methods, state.account, web3.utils]);

  async function acceptProposal(proposal) {
    setAcceptingProposal(proposal);

    try {
      await rawContract.methods
        .acceptProposal(proposal.imageHash, proposal.owner)
        .send({ from: state.account });

      handleProposalAccept(proposal.imageHash, proposal.owner);
      toast({
        title: 'Proposal accepted!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setProposals(state =>
        state.filter(p => p.imageHash !== proposal.imageHash)
      );
    } finally {
      setAcceptingProposal(null);
    }
  }

  async function refuseProposal(proposal) {
    setRefusingProposal(proposal);

    try {
      await rawContract.methods
        .refuseProposal(proposal.imageHash, proposal.owner)
        .send({ from: state.account });

      handleProposalRemoval(proposal.imageHash, proposal.owner);
      toast({
        title: 'Proposal refused!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setProposals(state => state.filter(p => p !== proposal));
    } finally {
      setRefusingProposal(null);
    }
  }

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
                  {proposals.length > 0 && (
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
                      {proposals.length}
                    </Text>
                  )}
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
                      {proposals.map(proposal => (
                        <Flex
                          key={`${proposal.owner}-${proposal.imageHash}`}
                          align="center"
                          justify="space-between"
                        >
                          <Flex align="center" gap="2">
                            <Image
                              src={`https://ipfs.infura.io/ipfs/${proposal.imageHash}`}
                              alt={proposal.imageName}
                              borderRadius="full"
                              boxSize="32px"
                              objectFit="cover"
                            />
                            <Text>{proposal.imageName}</Text>
                            <Text fontWeight="bold">{proposal.price} Ξ</Text>
                          </Flex>

                          <Flex gap="2">
                            <Button
                              size="xs"
                              colorScheme="green"
                              variant="ghost"
                              onClick={() => acceptProposal(proposal)}
                              isLoading={
                                acceptingProposal &&
                                acceptingProposal.imageHash ===
                                  proposal.imageHash &&
                                acceptingProposal.owner === proposal.owner
                              }
                              isDisabled={refusingProposal || acceptingProposal}
                            >
                              <CheckIcon />
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => refuseProposal(proposal)}
                              isLoading={
                                refusingProposal &&
                                refusingProposal.imageHash ===
                                  proposal.imageHash &&
                                refusingProposal.owner === proposal.owner
                              }
                              disabled={acceptingProposal || refusingProposal}
                            >
                              <CloseIcon fontSize="x-small" />
                            </Button>
                          </Flex>
                        </Flex>
                      ))}
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
