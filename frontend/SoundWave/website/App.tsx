import { StyleSheet, Text, View, Pressable, ScrollView, } from 'react-native';
import React, { FC } from 'react';
import Header from '../components/Header';
import { useRouter } from "expo-router";
// homepage

export default function App() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* replace with header component later*/}
      <Header title="SoundWave"/>

      <Text style={styles.title}>Popular</Text>
      <View style={styles.rowContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.horizontalContent}
        style={styles.scrollView}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Pressable key={i} style={styles.button} onPress={() => router.push("./Song")}>
            <Text style={styles.buttonText}>Test</Text>
          </Pressable>
        ))}
      </ScrollView>
      </View>

      <Text style={styles.title}>New Releases</Text>
      <View style={styles.rowContainer}>
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.horizontalContent}
        style={styles.scrollView}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Pressable key={i} style={styles.button} onPress={() => router.push("./Song")}>
            <Text style={styles.buttonText}>Test</Text>
          </Pressable>
        ))}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#BDBDBD',
    width: 220,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  horizontalContent: {
    flexDirection: "row",
    gap: 30,
    paddingVertical: 20,
    marginLeft: 20,
  },
  scrollView: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 30,
    height: '30%',
  },
  buttonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },  
});
