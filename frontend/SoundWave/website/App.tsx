import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Header from "../components/Header";
import SongCard from "../components/SongCard";

// homepage
export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="SoundWave" />

      {/* Vertical page scroll */}
      <ScrollView showsVerticalScrollIndicator>
        {/* ================= Popular ================= */}
        <Text style={styles.sectionTitle}>Popular</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.horizontalContent}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`popular-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={7}
              commentsCount={1284}
              onPress={() => router.push("./Song")}
            />
          ))}
        </ScrollView>

        {/* ================= New Releases ================= */}
        <Text style={styles.sectionTitle}>New Releases</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.horizontalContent}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SongCard
              key={`new-${i}`}
              variant="popular"
              title="Title"
              artist="Artist"
              rating={9}
              commentsCount={342}
              onPress={() => router.push("./Song")}
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
