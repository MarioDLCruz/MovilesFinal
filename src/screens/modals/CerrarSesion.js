import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

export default function LogoutModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Obtener la función de navegación

  // Abrir el modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Cierra sesión de Firebase
      Alert.alert("Éxito", "Has cerrado sesión correctamente."); // Muestra alerta de éxito
      handleCloseModal(); // Cierra el modal
      navigation.navigate("Home"); // Redirige a la pantalla Home
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión."); // Muestra alerta de error
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir el modal */}
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal de Confirmación de Cierre de Sesión */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Estás seguro?</Text>
            <Text style={styles.modalContent}>
              ¿Quieres cerrar sesión? Tu sesión actual será cerrada.
            </Text>

            {/* Botones de confirmación */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0075FF",
  },
  button: {
    backgroundColor: "#F20F7C",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro para el modal
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0075FF",
    marginBottom: 15,
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
});
