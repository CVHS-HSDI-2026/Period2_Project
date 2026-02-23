import { StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import CommentBoxWithTracks from '../../components/AlbumBox';
import AlbumDetails from '@components/AlbumDetails';

export default function Album() {

  return (
    <View style={styles.container}>
      <Header title="SoundWave" />
      <AlbumDetails/>
      <CommentBoxWithTracks/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2345',
  },
});
