import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '../../components/HeaderWithSearch';
import SongDetails from '../../components/SongDetails';
import SongBox from '../../components/SongBox';

export default function Song() {

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Header title="SoundWave" />
        <SongDetails />
        <SongBox />
      </View>
    </ScrollView>

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
