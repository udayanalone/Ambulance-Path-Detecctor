import { memo } from "react"
import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../utils/theme"

const Header = ({ isEmergencyMode }) => {
  return (
    <View style={[styles.header, isEmergencyMode ? styles.emergencyHeader : {}]}>
      <Text style={styles.title}>Ambulance Path Detector</Text>
      {isEmergencyMode && (
        <View style={styles.emergencyIndicator}>
          <Text style={styles.emergencyText}>EMERGENCY MODE</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emergencyHeader: {
    backgroundColor: COLORS.emergencyRed,
  },
  title: {
    color: COLORS.darkBlue,
    fontSize: 18,
    fontWeight: "bold",
  },
  emergencyIndicator: {
    marginTop: 4,
  },
  emergencyText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
})

export default memo(Header)

