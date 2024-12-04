import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { db } from "./firebase/config.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function D_Organize2({ navigation }) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventAddress, setEventAddress] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventRules, setEventRules] = useState("");
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Función para seleccionar una imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Guardar la URI de la imagen seleccionada
    }
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "events"), {
        title: eventName,
        date: Timestamp.fromDate(eventDate),
        address: eventAddress,
        description: eventDescription,
        rules: eventRules,
        host: "Organizador",
        image: image || "https://via.placeholder.com/150", // Imagen seleccionada o por defecto
      });
      console.log("Evento guardado con éxito");
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el evento: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Linker Bash</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del evento"
            value={eventName}
            onChangeText={setEventName}
          />
          <Ionicons name="md-create-outline" size={20} color="black" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.input}>
            {eventDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={eventDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dirección del evento"
            value={eventAddress}
            onChangeText={setEventAddress}
          />
          <Ionicons name="location-outline" size={20} color="black" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Descripción"
            value={eventDescription}
            onChangeText={setEventDescription}
            multiline
          />
          <Ionicons name="document-text-outline" size={20} color="black" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reglas"
            value={eventRules}
            onChangeText={setEventRules}
          />
          <Ionicons name="shield-checkmark-outline" size={20} color="black" style={styles.icon} />
        </View>

        {/* Imagen */}
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigation.goBack}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0075FF" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#0FF2BC", padding: 15 },
  headerText: { color: "black", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  formContainer: { marginTop: 30, paddingHorizontal: 20 },
  inputContainer: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: { flex: 1, height: 40, fontSize: 16, color: "black" },
  icon: { marginLeft: 10 },
  imageContainer: { alignItems: "center", marginVertical: 20 },
  image: { width: 200, height: 150, borderRadius: 10, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  button: {
    backgroundColor: "#F4D738",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "48%",
    alignItems: "center",
  },
  buttonText: { color: "black", fontWeight: "bold", fontSize: 16 },
});

export default D_Organize2;
