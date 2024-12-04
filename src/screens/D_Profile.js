import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "./firebase/config"; // Importa Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen({ navigation }) {  // Recibe navigation como prop
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const user = auth.currentUser;

  // Cargar datos del usuario al abrir la pantalla
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setDescription(data.description);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  // Actualizar datos del usuario
  const handleUpdateProfile = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        description,
      });
      Alert.alert("Éxito", "Tu perfil ha sido actualizado.");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error", "Hubo un problema al actualizar tu perfil.");
    }
  };

  const goToHelp = () => {
    // Navegar a la pantalla E_help
    navigation.navigate("E_Help");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Perfil</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Apellidos"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Añade una Descripción"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Actualizar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToHelp}>
        <Text style={styles.buttonText}>Configuración</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0075FF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F20F7C",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
