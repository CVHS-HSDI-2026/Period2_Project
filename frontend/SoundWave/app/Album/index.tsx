
import { StyleSheet, View, ScrollView,} from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import CommentBoxWithTracks from '../../components/AlbumBox';
import AlbumDetails from '@components/AlbumDetails';

export default function Album() {
  return (
    <View style = {styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        >
          <Header title="SoundWave" />
          <AlbumDetails/>
          <CommentBoxWithTracks/>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2345',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#1E2345',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#1E2345',
  },
});
