import React from 'react';
import { NativeBaseProvider, Box, Text, HStack, StatusBar, Center } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native'; // Asegúrate de importar TouchableOpacity
import Ionicons from 'react-native-vector-icons/Ionicons'; // Asegúrate de importar Ionicons

// Asegúrate de que las rutas de importación sean correctas
import ModalAyuda from './modals/Ayuda';
import ModalTerminos from './modals/terminos';
import ModalCerrar from './modals/CerrarSesion';

export default function App({ navigation }) {
  return (
    <NativeBaseProvider >
      {/* Header Text */}
      
        
      
      <Box flexDirection="row" mb="5" alignItems="left">
              {/* Flecha hacia atrás */}
              <TouchableOpacity  onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30}  />
                <Text style={styles.headerText}>Configuración</Text>
              </TouchableOpacity>
            </Box>
      <Box flex={1} safeArea>
        {/* Main Content Box */}
        <HStack flex={1}>
          <Box flex={1} bg="#0075FF" justifyContent="flex-start" alignItems="center" p={4}>
            {/* Top Row for other content if needed */}
           

            {/* Center Modals */}
            <Center flex={1}>
              <ModalAyuda />
              <ModalTerminos />
              <ModalCerrar />
            </Center>
          </Box>
        </HStack>

        {/* Status Bar */}
        <StatusBar barStyle="auto" />
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
    
      header: {
        padding: 20,
        backgroundColor: "#00FF9D",
        alignItems: "center",
      },
      headerText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "black",
      },
});
