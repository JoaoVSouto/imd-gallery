import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

export function UploadSection() {
  const [sentFile, setSentFile] = React.useState(null);
  const [imageTitle, setImageTitle] = React.useState('');
  const [hasImageTitleError, setHasImageTitleError] = React.useState(false);

  const toast = useToast();

  const onDrop = React.useCallback(acceptedFiles => {
    setSentFile(URL.createObjectURL(acceptedFiles[0]));
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
      <Heading size="lg">Upload your image to the world!</Heading>
      {!sentFile && (
        <Box
          {...getRootProps()}
          mt="8"
          border="1px dotted"
          transition="all 0.2s"
          borderColor={isDragActive ? 'teal.300' : 'gray.500'}
          borderRadius="xl"
          p="8"
        >
          <input {...getInputProps()} />
          <p>Click or drop your image here...</p>
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
