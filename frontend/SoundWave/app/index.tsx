import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import HeaderWithSearch from "../components/HeaderWithSearch";
import SongCard from "../components/SongCard";

// homepage
export default function App() {
  const router = useRouter();
  
  React.useEffect(() => {
    console.log("HOME PAGE LOADED");
  }, []);

  return (
    <View style={styles.container}>
      <HeaderWithSearch title="SoundWave" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= Popular ================= */}
        <Text style={styles.sectionTitle}>Popular</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`popular-${i}`}
              //variant="popular"
              title="Title"
              artist="Artist"
              rating={7}
              commentsCount={1284}
              onPress={() => router.push("Song")}
            />
          ))}
        </ScrollView>

        {/* ================= New Releases ================= */}
        <Text style={styles.sectionTitle}>New Releases</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`new-${i}`}
              //variant="new"
              title="Title"
              artist="Artist"
              rating={9}
              releaseDate="02/06/2026"
              onPress={() => router.push("Song")}  
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14172B",
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 20,
    color: "#FFFFFF",
  },

  horizontalContent: {
    flexDirection: "row",
    gap: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});