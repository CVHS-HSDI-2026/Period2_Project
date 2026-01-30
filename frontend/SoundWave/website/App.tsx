import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import Header from '../components/Header';
// homepage

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="SoundWave"/>

      <Text style={styles.title}>Popular</Text>
      <View style={styles.rowContainer}>
      </View>

      <Text style={styles.title}>New Releases</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },  
});
