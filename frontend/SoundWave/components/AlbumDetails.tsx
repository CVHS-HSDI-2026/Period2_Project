import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Album {
  title: string;
  artist: string;
  rating: string;
  genre: string;
  date: string;
  cover: string;
}

const AlbumDetails: React.FC = () => {
    const router = useRouter();
  const album: Album = {
    title: "Doo-Wops and Hooligans",
    artist: "Bruno Mars",
    rating: "8.5/10",
    genre: "Contemporary R&B",
    date: "10/4/10",
    cover: "https://picsum.photos/300" 
    
  };

  return (
    
    <View style={styles.outerContainer}>
      <View style={styles.contentRow}>
        {/* Left Side: Album Cover */}
        <Image source={{ uri: album.cover }} style={styles.cover} />

        {/* Right Side: Two-Column Data Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.column}>
            <Text style={styles.text}><Text style={styles.label}>Title: </Text>{album.title}</Text>
            <Text style={styles.text}>
            <Text style={styles.label}>Artist: </Text>
            <TouchableOpacity onPress={() => router.push("Artist")}>
            <Text style={styles.text}>{album.artist}</Text>
            </TouchableOpacity>
          </Text>
            <Text style={styles.text}><Text style={styles.label}>Date: </Text>{album.date}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.text}><Text style={styles.label}>Rating: </Text>{album.rating}</Text>
            <Text style={styles.text}><Text style={styles.label}>Min streamed: </Text>unknown</Text>
            <Text style={styles.text}><Text style={styles.label}>Genre: </Text>{album.genre}</Text>          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 4, // More square like the mockup
    marginRight: 25,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  column: {
    flex: 1,
    gap: 12, // Consistent spacing between rows
  },
  label: {
    fontWeight: '400',
    color: '#FFF',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'Jost_400Regular',
  },
});

export default AlbumDetails;