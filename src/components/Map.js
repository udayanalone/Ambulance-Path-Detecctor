import { useEffect, useRef, useState, memo } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { requestLocationPermission } from "../utils/permissions"; // Import permission function
import { calculateRoute } from "../utils/mapUtils";

const Map = ({ currentLocation, destination, isEmergencyMode, onLocationUpdate }) => {
  const mapRef = useRef(null);
  const [route, setRoute] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000, 
          timeout: 10000, 
        });

        const { latitude, longitude } = location.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        onLocationUpdate({ latitude, longitude });

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5, 
            timeInterval: 3000,
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setRegion((prevRegion) => ({
              ...prevRegion,
              latitude,
              longitude,
            }));
            onLocationUpdate({ latitude, longitude });
          }
        );
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Failed to get your location.");
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [onLocationUpdate]);

  useEffect(() => {
    if (currentLocation && destination) {
      calculateRoute(currentLocation, destination, isEmergencyMode)
        .then((routeCoordinates) => {
          setRoute(routeCoordinates);

          if (mapRef.current && routeCoordinates.length > 0) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error calculating route:", error);
          Alert.alert("Route Error", "Could not calculate the route.");
        });
    }
  }, [currentLocation, destination, isEmergencyMode]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        followsUserLocation={true}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Current Location" pinColor={COLORS.ambulanceBlue} />
        )}

        {destination && <Marker coordinate={destination} title="Destination" pinColor={COLORS.markerRed} />}

        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor={isEmergencyMode ? COLORS.emergencyRed : COLORS.routeBlue}
            lineDashPattern={isEmergencyMode ? null : [0]}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default memo(Map);
