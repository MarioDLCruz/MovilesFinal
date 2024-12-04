import React, { useState } from "react";
import { Center, Button, Modal, FormControl, Input, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config"; // Importa la configuración de Firebase
import { setDoc, doc } from "firebase/firestore"; // Para guardar datos en Firestore

const ModalRegistro = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Nombre
  const [lastName, setLastName] = useState(""); // Apellidos
  const [error, setError] = useState(""); // Para manejar errores de registro
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obtenemos el usuario registrado

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid, // Guardamos el UID único como userId
        firstName,
        lastName,
        email,
        description: "", // Campo inicial para descripción
      });

      // Cerrar el modal y redirigir al inicio o perfil
      setShowModal(false);
      navigation.navigate("Inicio"); // Redirige a la pantalla deseada
    } catch (err) {
      console.error("Error de Firebase:", err);
      setError(err.message); // Manejo de errores
    }
  };

  return (
    <Center>
      <Button
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: "#F20F7C",
          borderRadius: 0,
          borderWidth: 5,
          borderColor: "black",
        }}
        _text={{
          color: "black",
          fontSize: 24,
          fontFamily: "Roboto",
          fontWeight: "800",
        }}
      >
        REGISTRARSE
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px" style={{ backgroundColor: "#FAFF00" }}>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: "#FAFF00" }}>Registrarse</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl>
                <FormControl.Label>Nombre(s)</FormControl.Label>
                <Input
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                  placeholder="Introduce tu nombre"
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Apellidos</FormControl.Label>
                <Input
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                  placeholder="Introduce tus apellidos"
                />
              </FormControl>
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
                <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
              ) : null}
            </VStack>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#FAFF00" }}>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onPress={handleRegister} style={{ backgroundColor: "#F20F7C" }}>
                Registrarme
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default ModalRegistro;
