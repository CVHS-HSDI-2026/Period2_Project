import { StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import SongDetails from '../../components/SongDetails';
import CommentBoxWithTracks from '../../components/AlbumCommentBox';

export default function Album() {

  return (
    <View style={styles.container}>
      <Header title="SoundWave" />
      <SongDetails />
      <CommentBoxWithTracks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2345',
  },
});
