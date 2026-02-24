import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,} from "react-native";
import { ScrollView } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
type Tab = "comments" | "recommended";

export default function CommentBox() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
  const [fontsLoaded] = useFonts({ Jost_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Content */}
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

      {/*Need to add Thumbs up icon and reply icon with icon functionality*/}


      <Text style={styles.icon}>↩</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginTop: 10,
  },

  tabRow: {
    flexDirection: 'row',
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#161B36',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  activeTab: {
    backgroundColor: '#1E2345',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  tabText: {
    fontSize: 16,
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  contentBox: {
    backgroundColor: '#1E2345',
    borderRadius: 6,
    padding: 16,
    minHeight: 260,

    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3A3F6B',
    marginRight: 12,
  },

  commentText: {
    flex: 1,
    color: '#E6E8F2',
    fontSize: 20,
    fontFamily: 'Jost_400Regular',
    marginRight: 10,
  },

  icon: {
    color: '#9AA2D6',
    marginLeft: 10,
    fontSize: 14,
  },

  replyIndent: {
    marginLeft: 38,
  },

  emptyText: {
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
  },
});