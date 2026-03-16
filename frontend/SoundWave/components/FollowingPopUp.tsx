import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";
import React from "react";

type FollowingPopUpProps = {
    visible: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
};

export default function FollowingPopUp({visible, activeTab, setActiveTab, onClose}: FollowingPopUpProps) {
  if (!visible) return null;
  return (
    <Pressable style={styles.popUpOverlay} onPress={onClose}>
      <Pressable style={styles.popUpCard} onPress={(e) => e.stopPropagation()}>

        <Pressable style={styles.popUpClose} onPress={onClose}>
          <Text style={{ color: "white", fontSize: 20 }}>✕</Text>
        </Pressable>

        <View style={styles.popUpTabs}>
          <Pressable onPress={() => setActiveTab("following")}>
            <Text
              style={[
                styles.popUpTabText,
                activeTab === "following" && styles.activeTab
              ]}
            >
              Following
            </Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab("followers")}>
            <Text
              style={[
                styles.popUpTabText,
                activeTab === "followers" && styles.activeTab
              ]}
            >
              Followers
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.followRow}>
              <View style={styles.followAvatar} />
              <Text style={styles.followName}>Username</Text>
            </View>
          ))}
        </ScrollView>

      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  popUpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000090",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 90,
  },
  popUpCard: {
    width: "80%",
    maxWidth: 520,
    maxHeight: "90%",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 20,
  },
  popUpClose: {
    position: "absolute",
    right: 20,
    top: 15,
    zIndex: 2,
  },
  popUpTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    borderBottomWidth: 1,
    borderColor: "#ffffff20",
    paddingBottom: 10,
  },
  popUpTabText: {
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    userSelect: 'none',
  },
  activeTab: {
    color: "#9AA2D6",
  },
  scrollArea: {
    flex: 1,
    marginTop: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  followRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ffffff10",
  },
  followAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff30",
  },
  followName: {
    color: "white",
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    userSelect: 'none',
  },
});