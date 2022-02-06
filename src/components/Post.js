import {
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import Identicon from 'identicon.js';
import { useWeb3 } from 'react-ethers';
import { FiTrash2, FiSend } from 'react-icons/fi';

import { useApp } from '../contexts/App';
import { formatAddress } from '../utils/formatAddress';

export function Post({
  hash,
  name,
  owner,
  proposals,
  onAddProposal,
  onProposeRemoval,
}) {
  const { web3, rawContract } = useApp();
  const { state } = useWeb3();
  const toast = useToast();

  const removeSendProposalField =
    state.account === owner ||
    proposals.some(proposal => proposal.owner === state.account);

  async function createProposal(e) {
    e.preventDefault();

    const proposalValue = e.target.elements.proposal.value;

    await rawContract.methods.addProposal(hash).send({
      from: state.account,
      value: web3.utils.toWei(proposalValue, 'ether'),
    });

    toast({
      title: 'Proposal sent!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    e.target.reset();
    onAddProposal(
      hash,
      state.account,
      web3.utils.toWei(proposalValue, 'ether')
    );
  }

  async function removeProposal() {
    await rawContract.methods.removeProposal(hash).send({
      from: state.account,
    });
    toast({
      title: 'Proposal removed!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    onProposeRemoval(hash, state.account);
  }

  return (
    <Flex direction="column" h="100%">
      <Image
        src={`https://ipfs.infura.io/ipfs/${hash}`}
        alt={name}
        objectFit="cover"
        borderTopRadius="md"
        h="310px"
      />
      <Flex
        flex={1}
        bg="gray.700"
        py={2}
        borderBottomRadius="md"
        direction="column"
      >
        <Text fontWeight="semibold" fontSize="lg" px={4}>
          {name}
        </Text>
        <Flex px={4} gap={2} mb={1}>
          <Text fontStyle="italic" fontSize="sm">
            Owned by {formatAddress(owner)}
          </Text>
          <Image
            borderRadius="full"
            boxSize="20px"
            src={`data:image/png;base64,${new Identicon(owner, 20).toString()}`}
            alt="user profile"
          />
        </Flex>
        <Divider my={1} />
        <Flex flex={1} direction="column" px={4} gap={2}>
          <Flex direction="column" gap={1}>
            <Text fontWeight="semibold">Proposals</Text>
            {proposals.length === 0 && (
              <Text
                fontStyle="italic"
                fontSize="sm"
                color="gray.300"
                lineHeight="shorter"
                mb={1}
              >
                This piece doesn&apos;t have any proposals yet...
              </Text>
            )}

            {proposals.map(proposal => (
              <Flex key={proposal.owner} align="center" justify="space-between">
                <Flex align="center" gap={2}>
                  <Text>
                    {proposal.price} Ξ by {formatAddress(proposal.owner)}
                  </Text>
                  <Image
                    borderRadius="full"
                    boxSize="20px"
                    src={`data:image/png;base64,${new Identicon(
                      proposal.owner,
                      20
                    ).toString()}`}
                    alt="user profile"
                  />
                </Flex>
                {state.account === proposal.owner && (
                  <Tooltip
                    label="Remove your proposal"
                    placement="top"
                    bg="gray.600"
                    color="white"
                    hasArrow
                  >
                    <Button
                      colorScheme="red"
                      variant="link"
                      onClick={removeProposal}
                    >
                      <Icon as={FiTrash2} />
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            ))}
          </Flex>

          {!removeSendProposalField && (
            <Flex as="form" mt="auto" mb={1} onSubmit={createProposal}>
              <Input
                size="sm"
                name="proposal"
                type="number"
                step="any"
                placeholder="Send a proposal in ETH..."
                variant="filled"
                isRequired
              />
              <Button type="submit" colorScheme="messenger" variant="link">
                <Icon as={FiSend} />
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
