import { StyleSheet, Text, View, Pressable, } from 'react-native';
import React, { FC } from 'react';
import Header from '../components/Header';
import { useRouter } from "expo-router";

export default function Album() {
  const router = useRouter();
  return (
    <View style={styles.container}>
        {/* replace with header component later*/}
        <Header title="SoundWAVE"/>

        <Text style={styles.title}>Album Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDBDBD',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  buttonText: {
    fontSize: 20,
    padding: 100,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },  
});