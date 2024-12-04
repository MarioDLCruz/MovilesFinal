import React, { useState } from "react";
import { Center, Button, Modal, FormControl, Input, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config.js"; // Asegúrate de importar correctamente tu configuración de Firebase

const ModalInicio = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para manejar errores de inicio de sesión
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowModal(false); // Cierra el modal si el inicio de sesión es exitoso
      navigation.navigate("Inicio"); // Navega a la pantalla "Inicio"
    } catch (err) {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo."); // Muestra un mensaje de error
    }
  };

  return (
    <Center>
      <Button
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: "#FAFF00", // Color de fondo amarillo
          borderRadius: 0, // Sin bordes redondeados
          borderWidth: 5, // Borde ancho
          borderColor: "black", // Borde negro
        }}
        _text={{
          color: "black", // Color de texto negro
          fontSize: 24, // Tamaño de letra más grande
          fontFamily: "Roboto", // Fuente similar a Roboto
          fontWeight: "800", // Estilo Extra Bold
        }}
      >
        INICIAR SESION
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px" style={{ backgroundColor: "#F20F7C" }}>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: "#F20F7C" }}>
            Iniciar Sesion
          </Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl>
                <FormControl.Label>Correo Electrónico</FormControl.Label>
                <Input
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Introduce tu correo"
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Introduce tu contraseña"
                  secureTextEntry
                />
              </FormControl>
              {error ? (
                <Text style={{ color: "white", textAlign: "center" }}>{error}</Text>
              ) : null}
            </VStack>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#F20F7C" }}>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="yellow"
                onPress={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleLogin}
                style={{ backgroundColor: "#FAFF00" }}
              >
                Acceder
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default ModalInicio;
