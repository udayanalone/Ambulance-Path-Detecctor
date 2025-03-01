"use client"

import { useState, useCallback, memo } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from "react-native"
import { COLORS } from "../utils/theme"
import { searchLocation } from "../utils/mapUtils"

const PathControls = ({ onDestinationSelect, isEmergencyMode }) => {
  const [destination, setDestination] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [recentDestinations, setRecentDestinations] = useState([
    "City Hospital",
    "Central Medical Center",
    "Emergency Care Unit",
  ])

  const handleSearch = useCallback(async () => {
    if (!destination.trim()) return

    Keyboard.dismiss()
    setIsSearching(true)
    try {
      const result = await searchLocation(destination)
      if (result) {
        onDestinationSelect(result)

        if (!recentDestinations.includes(destination)) {
          setRecentDestinations((prev) => [destination, ...prev].slice(0, 5))
        }
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }, [destination, onDestinationSelect, recentDestinations])

  const handleRecentSelect = useCallback(
    async (place) => {
      setDestination(place)
      try {
        setIsSearching(true)
        const result = await searchLocation(place)
        if (result) {
          onDestinationSelect(result)
        }
      } catch (error) {
        console.error("Recent selection error:", error)
      } finally {
        setIsSearching(false)
      }
    },
    [onDestinationSelect],
  )

  return (
    <View style={[styles.container, isEmergencyMode ? styles.emergencyContainer : {}]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination hospital"
          value={destination}
          onChangeText={setDestination}
          placeholderTextColor={COLORS.gray}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.searchButton, isEmergencyMode ? styles.emergencyButton : {}]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Go</Text>
          )}
        </TouchableOpacity>
      </View>

      {recentDestinations.length > 0 && (
        <View style={styles.recentsContainer}>
          <Text style={styles.recentsTitle}>Recent Destinations:</Text>
          <View style={styles.recentsList}>
            {recentDestinations.map((place, index) => (
              <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleRecentSelect(place)}>
                <Text style={styles.recentItemText}>{place}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  emergencyContainer: {
    borderTopColor: COLORS.emergencyRed,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    color: COLORS.darkBlue,
  },
  searchButton: {
    backgroundColor: COLORS.primaryBlue,
    height: 46,
    width: 46,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyButton: {
    backgroundColor: COLORS.emergencyRed,
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  recentsContainer: {
    marginTop: 15,
  },
  recentsTitle: {
    fontSize: 14,
    color: COLORS.darkBlue,
    marginBottom: 8,
  },
  recentsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentItem: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  recentItemText: {
    color: COLORS.darkBlue,
    fontSize: 12,
  },
})

export default memo(PathControls)

