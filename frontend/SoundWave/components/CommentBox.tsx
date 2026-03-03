import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import RecommendedBox from "../components/RecomendedBox";
import Commentsonly from "./Commentsonly";

type Tab = "comments" | "recommended";

export default function CommentBox() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
  const [fontsLoaded] = useFonts({ Jost_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "comments" && styles.activeTab]}
          onPress={() => setActiveTab("comments")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "comments" && styles.activeTabText,
            ]}
          >
            Comments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "recommended" && styles.activeTab]}
          onPress={() => setActiveTab("recommended")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recommended" && styles.activeTabText,
            ]}
          >
            Recommended
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentBox}>
        {activeTab === "comments" ? (
          <Commentsonly />
        ) : (
          <RecommendedBox />
        )}
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
  borderBottomWidth: 0,   
  zIndex: 2,              
},

activeTab: {
  backgroundColor: '#1E2345',
},

contentBox: {
  backgroundColor: '#1E2345',
  borderRadius: 6,
  padding: 16,
  maxHeight: 350,
  borderWidth: 1,
  borderColor: '#FFFFFF',
  marginTop: -1,          
},

  tabText: {
    fontSize: 16,
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
  },

  activeTabText: {
    color: '#FFFFFF',
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
    marginLeft: 8,
  },

  emptyText: {
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
  },
  iconRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10, 
},

iconImage: {
  width: 16,
  height: 16,
  tintColor: "#ffffff", 
},
  isliked: {
  width: 16,
  height: 16,
  tintColor: "#1e00ff", 
},
replyBox: {
  marginLeft: 38,
  marginTop: 6,
  width: "90%",
},

replyInput: {
  backgroundColor: "#2A2F5A",
  padding: 8,
  borderRadius: 6,
  color: "white",
},

postReply: {
  color: "#9AA2D6",
  marginTop: 4,
},
replyVector: {
  width: 14,
  height: 14,
  marginRight: 6,
  tintColor: "#9AA2D6",
  alignSelf: "center",
},
});

