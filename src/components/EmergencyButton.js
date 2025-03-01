"use client"

import { useEffect, useRef, memo } from "react"
import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from "react-native"
import { COLORS } from "../utils/theme"

const EmergencyButton = ({ isActive, onToggle }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let animationLoop

    if (isActive) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      )

      animationLoop.start()
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop()
      }
    }
  }, [isActive, pulseAnim])

  return (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={[styles.button, isActive ? styles.activeButton : {}]}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={isActive ? "Deactivate emergency mode" : "Activate emergency mode"}
        accessibilityState={{ checked: isActive }}
      >
        <Text style={styles.buttonText}>{isActive ? "EMERGENCY ACTIVE" : "ACTIVATE EMERGENCY"}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    shadowColor: COLORS.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  button: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  activeButton: {
    backgroundColor: COLORS.emergencyRed,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
})

export default memo(EmergencyButton)

