import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function Profile() {
  return (
    <View style={styles.page}>
      <Header />

      {/* Profile Picture */}
      <View style={styles.profilePic} />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text><Text style={styles.bold}>Username:</Text></Text>
        <Text># followers</Text>
        <Text># ratings</Text>
      </View>

      {/* User Stats */}
      <View style={styles.userStats}>
        <Text><Text style={styles.bold}>Rating:</Text> #/10</Text>
        <Text># following</Text>
        <Text># comments</Text>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={styles.bold}>Bio:</Text>
        <View style={styles.bioLine} />
        <View style={styles.bioLine} />
        <View style={styles.bioLine} />
        <View style={styles.bioLine} />
      </View>

      {/* Top Songs */}
      <Text style={[styles.sectionTitle, { top: 330 }]}>Top Songs:</Text>

      <View style={[styles.row, { top: 370 }]}>
        {Array(5).fill(0).map((_, i) => (
          <View key={i} style={styles.card} />
        ))}
      </View>
    </View>
  );
}
