import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RecommendedBox() {
  return (
    <View>
      <Text style={styles.text}>No recommendations yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#E6E8F2",
    fontSize: 18,
    marginBottom: 10,
  },
});
