import React from 'react';
import { NativeBaseProvider, Box, Text, HStack, StatusBar, Center } from 'native-base';
import ModalInicio from './modals/InicioSesion';
import ModalRegistro from './modals/Registro';

export default function App() {
  return (
    <NativeBaseProvider>
      <Box flex={1} safeArea>
        <HStack flex={1}>
          <Box flex={1} bg="#0075FF" justifyContent="flex-start" alignItems="center" p={4}>
          <Box flexDirection="row" mb="5" alignItems="center">
                    <Box bg="#B138F5" borderRadius="md" px="8" py="1" mr="2">
                        <Text color="white" fontWeight="bold" fontSize="2xl">Linker</Text>
                    </Box>
                    <Box bg="#00E3D8" borderRadius="md" px="8" py="1">
                        <Text color="black" fontWeight="bold" fontSize="2xl">Bash</Text>
                    </Box>
                </Box>
            <Center flex={1}><ModalInicio /> <ModalRegistro /></Center>
          </Box>
        </HStack>
        <StatusBar barStyle="auto" />
      </Box>
    </NativeBaseProvider>
  );
}
