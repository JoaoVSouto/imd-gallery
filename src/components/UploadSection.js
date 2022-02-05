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
import { FiUpload } from 'react-icons/fi';
import { IoMdCloudUpload } from 'react-icons/io';

export function UploadSection() {
  const toast = useToast();

  const [sentFile, setSentFile] = React.useState(null);
  const [imageTitle, setImageTitle] = React.useState('');
  const [hasImageTitleError, setHasImageTitleError] = React.useState(false);

  const onDrop = React.useCallback(([uploadedFile]) => {
    if (uploadedFile) {
      setSentFile(URL.createObjectURL(uploadedFile));
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
    setImageTitle('');
    setHasImageTitleError(false);
  }

  function uploadFile() {
    if (!imageTitle.trim()) {
      setHasImageTitleError(true);
      return;
    }
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
            >
              Upload
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={resetFormState}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
