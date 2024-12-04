import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { db } from "./firebase/config"; // Asegúrate de que esta ruta es correcta
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MemoriesScreen = ({ navigation }) => {
  const [memories, setMemories] = useState([]);
  const [userId, setUserId] = useState(null);

  // Obtener el ID del usuario actual
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Escuchar eventos de la colección "memories" filtrados por usuario actual
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "memories"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMemories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(fetchedMemories);
    });

    return () => unsubscribe();
  }, [userId]);

  // Manejar la eliminación de un evento
  const handleDeleteMemory = (memoryId) => {
    Alert.alert(
      "Eliminar evento",
      "¿Estás seguro de que deseas eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const memoryRef = doc(db, "memories", memoryId);
              await deleteDoc(memoryRef);
              setMemories((prevMemories) =>
                prevMemories.filter((memory) => memory.id !== memoryId)
              );
              Alert.alert("Éxito", "El evento fue eliminado correctamente.");
            } catch (error) {
              console.error("Error al eliminar el evento:", error);
              Alert.alert("Error", "Hubo un problema al intentar eliminar el evento.");
            }
          },
        },
      ]
    );
  };

  // Renderizar cada evento
  const renderMemory = ({ item }) => (
    <View style={styles.memoryCard}>
      {/* Mostrar imagen del evento */}
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/50" }}
        style={styles.memoryImage}
      />
      <View style={styles.memoryDetails}>
        <Text style={styles.memoryTitle}>{item.title}</Text>
        <Text style={styles.memoryDate}>
          Asististe el {new Date(item.date?.seconds * 1000).toLocaleDateString("es-ES")}
        </Text>
      </View>
      {/* Botón para eliminar evento */}
      
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis Recuerdos</Text>
      </View>
      <FlatList
        data={memories}
        renderItem={renderMemory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes eventos registrados aún.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0075FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0FF2BC",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  listContainer: {
    padding: 20,
  },
  memoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  memoryImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  memoryDetails: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  memoryDate: {
    fontSize: 14,
    color: "gray",
  },
  deleteButton: {
    backgroundColor: "#FF5C5C",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginTop: 20,
  },
});

export default MemoriesScreen;
