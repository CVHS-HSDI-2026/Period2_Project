import { StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import SongDetails from '../../components/SongDetails';
import CommentBox from '../../components/CommentBox';

export default function Song() {

  return (
    <View style={styles.container}>
      <Header title="SoundWave" />

      <SongDetails />

      <CommentBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2345',
  },
});
