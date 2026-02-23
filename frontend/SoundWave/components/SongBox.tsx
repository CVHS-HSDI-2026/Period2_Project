import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import CommentBox from "./CommentBox";
import RecommendedBox from "./RecomendedBox";

type Tab = "comments" | "recomended";

export default function SongBox() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
  const [fontsLoaded] = useFonts({ Jost_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {["comments", "recomended"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as Tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.contentBox}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === "comments" && <CommentBox />}
          {activeTab === "recomended" && <RecommendedBox />}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginTop: 20,
    alignSelf: "center",
  },
  tabRow: {
    flexDirection: "row",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#161B36",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  activeTab: {
    backgroundColor: "#1E2345",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 16,
    color: "#9AA2D6",
    fontFamily: "Jost_400Regular",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  contentBox: {
    backgroundColor: "#1E2345",
    borderRadius: 6,
    padding: 16,
    minHeight: 260,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
});