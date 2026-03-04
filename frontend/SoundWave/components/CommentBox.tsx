import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";

type Tab = "comments" | "recommended";

export default function CommentBox() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
  const [fontsLoaded] = useFonts({ Jost_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
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
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginTop: 10,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#3A3F6B",
    marginRight: 12,
  },
  commentText: {
    flex: 1,
    color: "#E6E8F2",
    fontSize: 20,
    fontFamily: "Jost_400Regular",
    marginRight: 10,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: "#9AA2D6", // optional: recolor your icon to match your theme
  },
  replyIndent: {
    marginLeft: 38,
  },
  emptyText: {
    color: "#9AA2D6",
    fontFamily: "Jost_400Regular",
  },
});