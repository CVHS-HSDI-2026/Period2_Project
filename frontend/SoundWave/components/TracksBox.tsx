import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,} from "react-native";
import { ScrollView } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import { useRouter } from 'expo-router';

export default function TracksBox() {
  const [fontsLoaded] = useFonts({ Jost_400Regular });
  const router = useRouter();
  if (!fontsLoaded) return null;

  return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.push("Song")}>
            <Text style={styles.commentText} numberOfLines={2}>
              1. grenade
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              2. just the way you are
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              3. our first time
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              4. runaway baby
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              5. the lazy song
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              6.  marry you
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              7. talking to the moon
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              8. liquor store blues
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              9. count on me
            </Text>
            <Text style={styles.commentText} numberOfLines={2}>
              10. the other side (ft. Cee Lo Green & B.o.B)
            </Text>
          <Text style={styles.emptyText}>Tracks unavailable.</Text>
          </TouchableOpacity>
        </ScrollView>
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