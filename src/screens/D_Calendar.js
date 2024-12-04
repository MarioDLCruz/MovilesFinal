import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { db } from "./firebase/config";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [userId, setUserId] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

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

  // Obtener eventos pendientes del usuario y marcarlos en el calendario
  useEffect(() => {
    if (!userId) return;
  
    const eventsQuery = query(collection(db, "userEvents"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const newMarkedDates = {};
      fetchedEvents.forEach((event) => {
        const formattedDate = formatToCalendarDate(event.date); // Convertir `dd/mm/yyyy` a `yyyy-mm-dd`
        newMarkedDates[formattedDate] = {
          marked: true,
          dotColor: "blue",
        };
      });
  
      setAllEvents(fetchedEvents); // Guardar eventos para futuras comparaciones
      setMarkedDates(newMarkedDates); // Actualizar fechas marcadas en el calendario
    });
  
    return () => unsubscribe();
  }, [userId]);
  
  

  // Convertir de dd-mm-yyyy a yyyy-mm-dd para usar en el calendario
  const formatToCalendarDate = (firebaseDate) => {
    const [day, month, year] = firebaseDate.split("/"); // Divide la fecha en día, mes y año
    return `${year}-${month}-${day}`; // Reorganiza al formato `yyyy-mm-dd`
  };
  
  
  

  // Convertir de yyyy-mm-dd a dd-mm-yyyy para mostrar eventos
  const formatToDisplayDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  // Manejar la selección de una fecha y mostrar los eventos correspondientes
  const handleDayPress = (day) => {
    const selectedDateFormatted = day.dateString; // `yyyy-mm-dd` del calendario
    setSelectedDate(selectedDateFormatted);
  
    const eventsForDate = allEvents.filter(
      (event) => formatToCalendarDate(event.date) === selectedDateFormatted
    );
  
    setEventsForSelectedDate(eventsForDate); // Actualizar eventos para la fecha seleccionada
  };
  
  // Mover evento a recuerdos y eliminar de mis eventos
  const handleAttendEvent = async (event) => {
    if (!userId) {
      Alert.alert("Error", "No se pudo identificar al usuario.");
      return;
    }

    try {
      await addDoc(collection(db, "memories"), {
        title: event.title,
        date: event.date,
        userId: userId,
      });

      await deleteDoc(doc(db, "userEvents", event.id));

      setAllEvents((prevEvents) =>
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

      {/* Calendario */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: "blue",
              ...markedDates[selectedDate],
            },
          }}
          theme={{
            selectedDayBackgroundColor: "blue",
            todayTextColor: "red",
            arrowColor: "black",
          }}
        />
      </View>

      {/* Lista de eventos */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeader}>
          {selectedDate
            ? `Eventos para el ${formatToDisplayDate(selectedDate)}`
            : "Selecciona una fecha para ver los eventos"}
        </Text>
        <FlatList
          data={eventsForSelectedDate}
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
            <Text style={styles.noEventsText}>No hay eventos para esta fecha.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0075FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0FF2BC",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  calendarContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  noEventsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
