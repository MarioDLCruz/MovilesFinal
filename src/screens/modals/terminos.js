import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";

export default function TermsModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>Términos y Condiciones</Text>
      </TouchableOpacity>

      {/* Modal de Términos y Condiciones */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>

            {/* ScrollView para contenido largo */}
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.modalContent}>
                Estos son los términos y condiciones de nuestra aplicación. A continuación se describen los detalles de uso de la aplicación y nuestras políticas. Por favor, léelos detenidamente.
              </Text>
              <Text style={styles.modalContent}>
                1. Aceptación de los Términos: Al utilizar esta aplicación, aceptas cumplir con estos términos.
              </Text>
              <Text style={styles.modalContent}>
                2. Uso de la Aplicación: La aplicación está destinada solo para usuarios registrados. Está prohibido el uso indebido de la aplicación.
              </Text>
              <Text style={styles.modalContent}>
                3. Privacidad: Nos comprometemos a proteger tu información personal. Consulta nuestra política de privacidad para más detalles.
              </Text>
              <Text style={styles.modalContent}>
                4. Modificaciones: Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente.
              </Text>
              {/* Puedes agregar más términos según lo necesites */}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
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
  scrollContainer: {
    width: "100%",
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#F20F7C",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
