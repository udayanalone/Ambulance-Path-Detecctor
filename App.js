"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { SafeAreaView, StyleSheet, StatusBar, View, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Header from "./src/components/Header";
import PathControls from "./src/components/PathControls";
import EmergencyButton from "./src/components/EmergencyButton";
import { COLORS } from "./src/utils/theme";
import { requestLocationPermission } from "./src/utils/permissions";
import { calculateRoute } from "./src/utils/mapUtils";

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [route, setRoute] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    startLocationTracking();
  }, []);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCurrentLocation(location.coords);

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
        (newLocation) => {
          setCurrentLocation(newLocation.coords);
        }
      );
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get location.");
    }
  };

  useEffect(() => {
    if (currentLocation && destination) {
      calculateRoute(currentLocation, destination, isEmergencyMode).then(setRoute);
    }
  }, [currentLocation, destination, isEmergencyMode]);

  const handleEmergencyToggle = useCallback(() => {
    setIsEmergencyMode((prev) => !prev);
  }, []);

  const handleDestinationSelect = useCallback((coords) => {
    setDestination(coords);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightBlue} />
        <Header isEmergencyMode={isEmergencyMode} />
        <View style={styles.mapContainer}>
          <MapView ref={mapRef} style={styles.map} showsUserLocation showsMyLocationButton>
            {currentLocation && <Marker coordinate={currentLocation} title="Current Location" pinColor={COLORS.ambulanceBlue} />}
            {destination && <Marker coordinate={destination} title="Destination" pinColor={COLORS.markerRed} />}
            {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor={isEmergencyMode ? COLORS.emergencyRed : COLORS.routeBlue} />}
          </MapView>
        </View>
        <PathControls onDestinationSelect={handleDestinationSelect} isEmergencyMode={isEmergencyMode} />
        <EmergencyButton isActive={isEmergencyMode} onToggle={handleEmergencyToggle} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
