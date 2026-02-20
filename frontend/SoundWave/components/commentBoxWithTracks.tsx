import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";

type Tab = "comments" | "recommended";

export default function commentBoxWithTracks() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
  const [fontsLoaded] = useFonts({ Jost_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "comments" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("comments")}
        >
          <Text style={styles.tabText}>Comments:</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "recommended" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("recommended")}
        >
          <Text style={styles.tabText}>Recommended:</Text>
        </TouchableOpacity>
                <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "recommended" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("recommended")}
        >
          <Text style={styles.tabText}>Recommended:</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentBox}>
        {activeTab === "comments" ? (
          <>
            <Comment text="Wow this is so peak Kenshi really outdid himself this time yad wa wadsda..." />
            <Comment text="Ts so mid how did he even come up with this. This song is a disgrace to j-pop." />
            <Comment text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do temporas..." />
            <View style={styles.replyIndent}>
              <Comment text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, se dor amit..." />
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No recommendations yet.</Text>
        )}
      </View>
    </View>
  );
}

/* Individual comment row */
function Comment({ text }: { text: string }) {
  return (
    <View style={styles.commentRow}>
      <View style={styles.avatar} />
      <Text style={styles.commentText} numberOfLines={2}>
        {text}
      </Text>
      <Text style={styles.icon}>👍</Text>
      <Text style={styles.icon}>↩</Text>
    </View>
  );
}

/* ✅ PROFILE-MATCHING STYLES */
const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginTop: 20,
  },

  tabRow: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#181B33",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginRight: 8,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },

  tabText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Jost_400Regular",
  },

  contentBox: {
    borderWidth: 1,
    borderColor: "#2E325A",
    backgroundColor: "#181B33",
    padding: 14,
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#BDBDBD",
    marginRight: 12,
  },

  commentText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    marginRight: 8,
  },

  icon: {
    color: "#FFFFFF",
    marginLeft: 10,
    opacity: 0.7,
  },

  replyIndent: {
    marginLeft: 42,
  },

  emptyText: {
    color: "#FFFFFF",
    fontFamily: "Jost_400Regular",
    opacity: 0.6,
  },
});