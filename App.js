import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./src/context/UserContext";

// Import Screens
import LoginScreen from "./src/screens/LoginScreen";
import DriverScreen from "./src/screens/DriverScreen";
import HospitalScreen from "./src/screens/HospitalScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Driver" component={DriverScreen} />
          <Stack.Screen name="Hospital" component={HospitalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
