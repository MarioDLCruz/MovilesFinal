import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "./src/screens/A_HomeScreen";
import Events from "./src/screens/C_Events";
import Calendar from "./src/screens/D_Calendar";
import Memories from "./src/screens/D_Memories";
import Organize from "./src/screens/D_Organize";
import Profile from "./src/screens/D_Profile";

import D_Organize2 from './src/screens/D_Organize2';
import E_Help from './src/screens/E_Help';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabScreens() {
  return (
    <Tab.Navigator
      initialRouteName="Eventos"
      screenOptions={({ route }) => ({
        tabBarStyle: { position: "absolute" },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Organizar") {
            iconName = "create-outline"; 
          } else if (route.name === "Agenda") {
            iconName = "calendar-outline";
          } else if (route.name === "Eventos") {
            iconName = "people-outline";
          } else if (route.name === "Recuerdos") {
            iconName = "images-outline";
          } else if (route.name === "Perfil") {
            iconName = "person-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Organizar" component={Organize} options={{ headerShown: false }} />
      <Tab.Screen name="Agenda" component={Calendar} options={{ headerShown: false }} />
      <Tab.Screen name="Eventos" component={Events} options={{ headerShown: false }} />
      <Tab.Screen name="Recuerdos" component={Memories} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={TabScreens} options={{ headerShown: false }} />
        <Stack.Screen name="D_Organize2" component={D_Organize2} options={{ headerShown: false }} />
        <Stack.Screen name="E_Help" component={E_Help} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
