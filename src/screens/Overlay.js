import React from 'react';
import { NativeBaseProvider, Box, Text, Button, HStack, StatusBar, Center, AlertDialog, Menu, Pressable, HamburgerIcon } from 'native-base';

const AlertExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  return (
    <Center>
      <Button colorScheme="danger" onPress={() => setIsOpen(!isOpen)}>
        Delete Customer
      </Button>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Customer</AlertDialog.Header>
          <AlertDialog.Body>
            This will remove all data relating to Alex. This action cannot be
            reversed. Deleted data cannot be recovered.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={onClose}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

const MenuExample = () => {
  return (
    <Box w="90%" alignItems="center">
      <Menu w="190" trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <HamburgerIcon />
          </Pressable>
        );
      }}>
        <Menu.Item>Arial</Menu.Item>
        <Menu.Item>Nunito Sans</Menu.Item>
        <Menu.Item>Roboto</Menu.Item>
        <Menu.Item>Poppins</Menu.Item>
        <Menu.Item>SF Pro</Menu.Item>
        <Menu.Item>Helvetica</Menu.Item>
        <Menu.Item isDisabled>Sofia</Menu.Item>
        <Menu.Item>Cookie</Menu.Item>
      </Menu>
    </Box>
  );
};

export default function App() {
  return (
    <NativeBaseProvider>
      <Box flex={1} safeArea>
        <HStack flex={1}>

          {/* Primer espacio con AlertExample */}
          <Box flex={1} bg="rgba(255, 99, 99, 0.5)" justifyContent="flex-start" alignItems="center" p={4}>
            <Text fontSize="xl" mt={5}>AlertDialog</Text>
            <AlertExample />
          </Box>

          {/* Segundo espacio con MenuExample */}
          <Box flex={1} bg="rgba(99, 255, 99, 0.5)" justifyContent="flex-start" alignItems="center" p={4}>
            <Text fontSize="xl" mt={5}>Menu</Text>
            <MenuExample />
          </Box>

          {/* Tercer espacio */}
          <Box flex={1} bg="rgba(127, 255, 212, 0.5)" justifyContent="flex-start" alignItems="center" p={4}>
            <Text fontSize="xl" mt={5}>Modal</Text>
            <Button onPress={() => console.log("hello world")}>Click Me</Button>
          </Box>

          {/* Cuarto espacio */}
          <Box flex={1} bg="rgba(255, 255, 99, 0.5)" justifyContent="flex-start" alignItems="center" p={4}>
            <Text fontSize="xl" mt={5}>Popover</Text>
            <Button onPress={() => console.log("hello world")}>Click Me</Button>
          </Box>

        </HStack>
        <StatusBar barStyle="auto" />
      </Box>
    </NativeBaseProvider>
  );
}
