import { StyleSheet, View, ScrollView,} from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import CommentBoxWithTracks from '../../components/AlbumBox';
import AlbumDetails from '@components/AlbumDetails';

export default function Album() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Header title="SoundWave" />
        <AlbumDetails/>
        <CommentBoxWithTracks/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2345', // ensures even system areas (like notch/edges) match
  },
  scroll: {
    flex: 1,
    backgroundColor: '#1E2345', // scroll view background
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#1E2345', // ensures the scrollable content area matches
  },
});