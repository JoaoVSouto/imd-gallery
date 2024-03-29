import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import ipfsClient from 'ipfs-http-client';
import { useCall, useWeb3 } from 'react-ethers';
import { FiUpload } from 'react-icons/fi';
import { IoMdCloudUpload } from 'react-icons/io';

import { useApp } from '../contexts/App';

const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export function UploadSection() {
  const toast = useToast();
  const { state } = useWeb3();
  const { contract } = useApp();
  const { contractCall } = useCall();

  const [sentFile, setSentFile] = React.useState(null);
  const [fileBuffer, setFileBuffer] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [imageTitle, setImageTitle] = React.useState('');
  const [hasImageTitleError, setHasImageTitleError] = React.useState(false);

  const onDrop = React.useCallback(([uploadedFile]) => {
    if (uploadedFile) {
      setSentFile(URL.createObjectURL(uploadedFile));

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(uploadedFile);

      reader.onloadend = () => {
        setFileBuffer(Buffer(reader.result));
      };
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
    onDropRejected: () =>
      toast({
        title: 'Only images and gifs are accepted!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      }),
  });

  function handleImageTitleChange(e) {
    setImageTitle(e.target.value);
    setHasImageTitleError(false);
  }

  function resetFormState() {
    setSentFile(null);
    setFileBuffer(null);
    setImageTitle('');
    setHasImageTitleError(false);
  }

  function uploadFile() {
    if (!imageTitle.trim()) {
      setHasImageTitleError(true);
      return;
    }

    setIsUploading(true);

    ipfs.add(fileBuffer, async (err, result) => {
      const showErrorToast = () =>
        toast({
          title: 'Error on uploading file',
          description: 'Please try again later',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });

      if (err) {
        setIsUploading(false);
        showErrorToast();
        return;
      }

      const [{ hash: fileHash }] = result;

      try {
        await contractCall(contract, 'uploadImage', [
          imageTitle.trim(),
          fileHash,
        ]);

        toast({
          title: 'File uploaded!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      } catch {
        showErrorToast();
      } finally {
        setIsUploading(false);
        resetFormState();
      }
    });
  }

  if (!state.isLogged) {
    return null;
  }

  return (
    <Box mt="8">
      {!sentFile && (
        <Box
          {...getRootProps()}
          mt="8"
          border="2px dotted"
          transition="all 0.2s"
          borderColor={isDragActive ? 'blue.400' : 'gray.500'}
          borderRadius="md"
          p="8"
          textAlign="center"
          pos="relative"
          overflow="hidden"
        >
          <input {...getInputProps()} />
          <Text fontSize="2xl">Upload your image or gif to the gallery!</Text>
          <Text color="gray.500">Click here or drag your file...</Text>

          <Icon
            as={IoMdCloudUpload}
            fontSize="180px"
            pos="absolute"
            transition="all 0.2s"
            color={isDragActive ? 'blue.400' : 'gray.700'}
            opacity={isDragActive ? 0.4 : 0.8}
            top="-13px"
            left="10px"
            zIndex="-1"
            display={{ base: 'none', md: 'block' }}
          />
        </Box>
      )}

      {sentFile && (
        <Flex
          align="center"
          mt="8"
          direction="column"
          gap="4"
          maxW={300}
          mx="auto"
        >
          <Heading fontWeight="semibold" fontSize="2xl" mr="auto">
            Setup your file
          </Heading>
          <Image
            src={sentFile}
            alt="Image to be uploaded"
            borderRadius="md"
            boxSize="300px"
            objectFit="cover"
          />
          <FormControl isInvalid={hasImageTitleError}>
            <FormLabel htmlFor="image-title">Image title</FormLabel>
            <Input
              id="image-title"
              value={imageTitle}
              onChange={handleImageTitleChange}
            />
            {hasImageTitleError && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <Flex gap="2" w="100%" justify="flex-end">
            <Button
              colorScheme="green"
              leftIcon={<FiUpload />}
              onClick={uploadFile}
              isLoading={isUploading}
            >
              Upload
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={resetFormState}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
