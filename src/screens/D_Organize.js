import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "./firebase/config";
import { collection, onSnapshot, doc, deleteDoc, addDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function HomeScreen({ navigation }) {
  const [userEvents, setUserEvents] = useState([]);
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

  // Escuchar eventos en tiempo real filtrados por el usuario actual
  useEffect(() => {
    if (!userId) return;

    const userEventsQuery = query(collection(db, "userEvents"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(userEventsQuery, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, [userId]);

  // Mover evento a recuerdos y eliminar de mis eventos
  const handleAttendEvent = async (event) => {
    if (!userId) {
      Alert.alert("Error", "No se pudo identificar al usuario.");
      return;
    }
  
    try {
      // Agregar a la colección de recuerdos con el userId e imagen
      await addDoc(collection(db, "memories"), {
        title: event.title,
        date: event.date,
        userId: userId, // Relacionar el evento con el usuario actual
        image: event.image, // Incluir la imagen al moverlo a recuerdos
      });
  
      // Eliminar el evento de mis eventos en Firestore
      await deleteDoc(doc(db, "userEvents", event.id));
  
      // Actualizar el estado localmente para eliminar el evento de la lista
      setUserEvents((prevEvents) =>
        prevEvents.filter((userEvent) => userEvent.id !== event.id)
      );
  
      Alert.alert("¡Asististe!", "El evento fue añadido a tus recuerdos.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al procesar tu solicitud.");
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Linker Bash</Text>
      </View>

      {/* Botón para crear evento */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("D_Organize2")}
        >
          <Text style={styles.buttonText}>Crear evento</Text>
        </TouchableOpacity>

        {/* Lista de eventos */}
        <FlatList
          data={userEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard}>
              <Ionicons name="calendar" size={40} color="black" style={styles.icon} />
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventSubtitle}>{item.date}</Text>
              </View>
              <TouchableOpacity
                style={styles.attendButton}
                onPress={() => handleAttendEvent(item)}
              >
                <Text style={styles.attendButtonText}>Asistí</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes eventos organizados aún.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A4FF",
  },
  header: {
    padding: 20,
    backgroundColor: "#00FF9D",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#7200FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  attendButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
  },
  attendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});

export default HomeScreen;
