import { Platform, Alert, Linking } from "react-native";
import * as Location from "expo-location";

export const requestLocationPermission = async () => {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "This app needs location permission to function properly. Would you like to open settings to enable location services?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }

    // Request background location permission (Only required for Android)
    if (Platform.OS === "android") {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        console.warn("Background location permission not granted");
      }
    }

    return true;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};
