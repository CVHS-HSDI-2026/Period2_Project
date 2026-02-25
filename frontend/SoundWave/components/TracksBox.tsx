import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import { useRouter } from "expo-router";

export default function TracksBox() {
  const [fontsLoaded] = useFonts({ Jost_400Regular });
  const router = useRouter();
  if (!fontsLoaded) return null;

  const tracks = [
    "1. Grenade",
    "2. Just The Way You Are",
    "3. Our First Time",
    "4. Runaway Baby",
    "5. The Lazy Song",
    "6. Marry You",
    "7. Talking To The Moon",
    "8. Liquor Store Blues",
    "9. Count On Me",
    "10. The Other Side (ft. Cee Lo Green & B.o.B)",
  ];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {tracks.map((track, index) => (
        <TouchableOpacity key={index} onPress={() => router.push("Song")}>
          <Text style={styles.commentText}>{track}</Text>
        </TouchableOpacity>
      ))}

      {/* Optional placeholder for when no tracks are available */}
      {tracks.length === 0 && (
        <Text style={styles.emptyText}>Tracks unavailable.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 300,
  },
  scrollContent: {

  },
  commentText: {
    color: "#E6E8F2",
    fontSize: 20,
    fontFamily: "Jost_400Regular",
    marginBottom: 10,
  },
  emptyText: {
    color: "#9AA2D6",
    fontFamily: "Jost_400Regular",
    textAlign: "center",
    marginTop: 10,
  },
});