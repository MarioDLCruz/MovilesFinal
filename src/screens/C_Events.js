import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Animated } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase/config";
import { collection, onSnapshot, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";

const EventCard = ({ event, onAssist, onDelete, index }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de opacidad

  // Configuración de la animación Stagger (entrada con retraso)
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 150, // Añadir retraso por cada ítem para simular el stagger
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  const formattedDate = event.date?.toDate?.().toLocaleDateString() || "Sin fecha";

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.hostTag}>
        <Text style={styles.hostText}>{event.host}</Text>
      </View>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{formattedDate}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.buttonAssist} onPress={() => onAssist(event)}>
          <Text style={styles.buttonText}>Asistiré</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const EventsScreen = ({ userId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleAssist = async (event) => {
    try {
      if (!userId) {
        alert("Error: No se ha definido el usuario actual.");
        return;
      }

      const userEvent = {
        title: event.title,
        date: event.date?.toDate ? event.date.toDate().toLocaleDateString() : "Sin fecha",
        host: event.host,
        image: event.image, // Incluir la imagen al guardar
        userId: userId,
      };

      await addDoc(collection(db, "userEvents"), userEvent);
      alert("¡Te has registrado para este evento!");
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      alert("Hubo un problema al registrarte para este evento.");
    }
  };

  const handleDelete = async (eventTitle) => {
    Alert.alert(
      "Eliminar evento",
      `¿Estás seguro de que deseas eliminar el evento "${eventTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              // Buscar el evento por título en la base de datos
              const eventsQuery = query(collection(db, "events"), where("title", "==", eventTitle));
              const querySnapshot = await getDocs(eventsQuery);

              if (!querySnapshot.empty) {
                // Eliminar cada coincidencia (aunque en teoría debería ser único por título)
                querySnapshot.forEach(async (docSnapshot) => {
                  await deleteDoc(docSnapshot.ref);
                });

                // Actualizar el estado local
                setEvents((prevEvents) => prevEvents.filter((event) => event.title !== eventTitle));
                alert("El evento ha sido eliminado.");
              } else {
                alert("No se encontró el evento en la base de datos.");
              }
            } catch (error) {
              console.error("Error al eliminar el evento:", error);
              alert("Hubo un problema al eliminar el evento.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <ActivityIndicator size="large" color="#00A4FF" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <EventCard event={item} onAssist={handleAssist} onDelete={handleDelete} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const App = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A4FF" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Por favor, inicia sesión para ver los eventos.</Text>
      </View>
    );
  }

  return <EventsScreen userId={userId} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A4FF",
  },
  cardContainer: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  hostTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#7200FF",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  hostText: {
    color: "white",
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  textContainer: {
    marginVertical: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    color: "gray",
  },
  eventDescription: {
    fontSize: 14,
    color: "black",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonAssist: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  buttonDelete: {
    backgroundColor: "#FF5C5C",
    padding: 10,
    borderRadius: 5,
    flex: 0.3,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notLoggedInText: {
    fontSize: 16,
    color: "gray",
  },
});

export default App;
