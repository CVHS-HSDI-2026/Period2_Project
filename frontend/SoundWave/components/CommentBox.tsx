import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const CommentBox = () => {
  return (
    <View style={styles.commentBox}>
      <Text>User icon + comment area goes here</Text>
    </View>
  );
};

export default CommentBox;

const styles = StyleSheet.create({
  commentBox: {
    marginTop: 40,
    height: 250,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 15,
  },
});
